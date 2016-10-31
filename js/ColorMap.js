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

// Global vars - TODO: Move these to functions calls
// var colorBy = function(d) { return globals.colorByParty(d.properties.incum_party) };
var colorBy = function(d) { return globals.colorByRegion(d.properties.district_label); };

var featureLabel = function(d) { return d.properties.district; };
// var featureLabel = null;

// Make choropleth obsolete by adding a custom c

var ColorMap = function (props){
  this.data = props.data;
  this.element = props.element;
  this.height = props.height;
  this.aspectRatio = props.aspectRatio;
  this.margin = {top: 20, bottom: 20, right: 30, left: 30};

  console.log(this.data);

  this.draw()
}
ColorMap.prototype.draw = function() {

  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;
  if (!this.height){
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
    .attr("fill", "black")
    .text(featureLabel)
}


  // // Old Code for drawing directly from json

  // // Scales to translate x & y coords into pixel dimensions
  // // Single scale because blocks are square
  // this.scale = d3.scaleLinear()
  //   .range([0, this.plotWidth])
  //   .domain([0, 20]) // TODO: un-hardcode


  // // CURRENT CODE ASSUME FIRST DIMENSION IS MINIMUM
  // // TODO: Add functions to test data integrity
  // // TODO: Add data join so it's possible to color by SD data (region, incumbent, etc.)

  // // Determine rectangle dimensions, [width, height]
  // var that = this;
  // this.data.forEach(function(d){
  //   d.dims = [
  //     that.blockDim + Math.abs(d.coords[0][0] - d.coords[1][0]),
  //     that.blockDim + Math.abs(d.coords[0][1] - d.coords[1][1])
  //   ]
  // });

  // // Draw rectangles

  // this.districts = this.plot.append("g")
  //   .selectAll('.district')
  //   .data(this.data).enter()
  //   .append("g").attr("class", "district");
  // this.districts.append("rect")
  //   .attr("fill", "green")
  //   .attr("stroke", "gray")
  //   .attr("x", function(d) { return that.scale(d.coords[0][0]); })
  //   .attr("y", function(d) { return that.scale(d.coords[0][1]); })
  //   .attr("width", function(d) { return that.scale(d.dims[0]); })
  //   .attr("height", function(d) { return that.scale(d.dims[1]); })
  // this.districts.append("text")
  //   .attr("class", "label")
  //   .attr("x", function(d) { return that.scale(d.coords[0][0] + d.dims[0] / 2); })
  //   .attr("y", function(d) { return that.scale(d.coords[0][1] + d.dims[1] / 2); })
  //   .text(function(d) { return d.sd; })