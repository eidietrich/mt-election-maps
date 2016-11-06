// ColorMapByDistrict

// Draws map with color
// (Also works for cartograms when data is provided as a geojson)

// Expects data as a geojson

/* Sample initialization
var senateMap = new ColorMapByDistrict({
        'element': document.querySelector('#chart2'),
        'data': bindToGeoJson(mtSenDistricts, mtSenData, 'number', 'number',
            ['district', 'incum_party', 'district_label']),
        'aspectRatio': .6
      })
*/

 /*  Possible settings for colorLable and featureLabel:
  colorLabel = function(d) { return globals.colorByParty(d.properties.incum_party) };
  colorLabel = function(d) { return globals.colorByRegion(d.properties.district_label); };
  featureLabel = function(d) { return d.properties.district; };
  */


var ColorMapByDistrict = function (props){

  this.data = props.data;
  this.element = props.element;
  this.height = props.height;
  this.heightNotDefined = !props.height;
  this.aspectRatio = props.aspectRatio;
  this.margin = {top: 20, bottom: 20, right: 30, left: 30};

  console.log('ColorMapByDistrict called with', this.data);

  // Supporting text
  this.title = props.title || "";
  this.cutline = props.cutline || "";

  // set colorBy and featureLabel props, or default

  if (props.colorBy){
    this.colorBy = props.colorBy;
  } else {
    this.colorBy = "gray";
  }
  if (props.featureLabel) {
    this.featureLabel = props.featureLabel;
  } else {
    this.featureLabel = null;
  }

  // console.log(this.data);

  this.shapeData()
  this.draw()
  // this.addTooltip() // TODO
}
ColorMapByDistrict.prototype.shapeData = function(){
  this.data.features.forEach(function(feature){
    feature.properties.fillColor = globals.classifyRace(feature.properties);
  })
}
ColorMapByDistrict.prototype.draw = function() {

  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;
  if (this.heightNotDefined){
    this.height = this.width * this.aspectRatio
  }
  this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  this.plotWidth = this.width - this.margin.left - this.margin.right;

  // Supporting text
  d3.select(this.element).append("h3")
    .html(this.title);
  d3.select(this.element).append("p")
    .html(this.cutline);

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
  this.districts = this.plot.append("g")
    .selectAll("path")
    .data(this.data.features)
    .enter();
  this.districts.append("path")
    .attr("d", path)
    // .attr("fill", this.colorBy)
    .attr("fill", function(d){ return d.properties.fillColor; })
    .attr("class", "districts")

  // Add text labels
  this.districts.append("text")
    .attr("x", function(d){ return path.centroid(d)[0]; })
    .attr("y", function(d) { return path.centroid(d)[1]; })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(this.featureLabel)
}