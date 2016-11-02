// ColorMap

// Draws map with color
// (Also works for cartograms when data is provided as a geojson)

// Expects data as a geojson

/* Sample initialization
var senateMap = new ColorMap({
        'element': document.querySelector('#chart2'),
        'data': bindToGeoJson(mtSenDistricts, mtSenData, 'number', 'number',
            ['district', 'incum_party', 'district_label']),
        'aspectRatio': .6
      })
*/

// Global vars - TODO: Move these to functions calls in index.html
var colorBy = function(d) { return globals.colorByParty(d.properties.incum_party) };
// var colorBy = function(d) { return globals.colorByRegion(d.properties.district_label); };

var featureLabel = function(d) { return d.properties.district; };

var ColorMap = function (props){
  this.data = props.data;
  this.element = props.element;
  this.height = props.height;
  this.heightNotDefined = !props.height;
  this.aspectRatio = props.aspectRatio;
  this.margin = {top: 20, bottom: 20, right: 30, left: 30};

  // console.log(this.data);

  this.draw()
}
ColorMap.prototype.draw = function() {

  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;
  if (this.heightNotDefined){
    this.height = this.width * this.aspectRatio
  }
  this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  this.plotWidth = this.width - this.margin.left - this.margin.right;

  this.svg = d3.select(this.element)
    .append('svg')
    .attr("width", this.width)
    .attr("height", this.height);
  this.plot = this.svg.append('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

  // Initialize projection & path
  var projection = d3.geoMercator()
    .fitExtent([[10,10],[this.plotWidth, this.plotHeight]], this.data);
  var path = d3.geoPath()
    .projection(projection);

  // Draw map of districts
  var districts = this.plot.append("g")
    .selectAll("path")
    .data(this.data.features)
    .enter();
  districts.append("path")
    .attr("d", path)
    .attr("fill", colorBy)
    .attr("class", "districts")
  districts.append("text")
    .attr("x", function(d){ return path.centroid(d)[0]; })
    .attr("y", function(d) { return path.centroid(d)[1]; })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(featureLabel)
}