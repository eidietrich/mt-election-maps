// Base Choropleth map
// expects data in geojson format, with the following in properties:
// - centerCoords: [lon, lat] array with centroid (for label placement)
// - votersForA: mapped dimension (with color)
// - votesCast: denominator for mapped dimension

var Choropleth = function (props, globals){
  this.data = props.data;
  this.element = props.element;
  this.width = props.width;
  this.height = props.height;

  console.log(this.data);

  // this.mergeData()
  this.draw()
}
Choropleth.prototype.draw = function() {

  this.svg = d3.select(this.element)
      .append('svg')
      .attr("width", this.width)
      .attr("height", this.height)

  // Initialize projection & path
  var projection = d3.geoMercator()
    .fitExtent([[10,10],[this.width, this.height]], this.data);
  var path = d3.geoPath()
    .projection(projection);

  // Draw map of districts
  var districts = this.svg.append("g")
    .selectAll("path")
    .data(this.data.features)
    .enter();

  districts.append("path")
    .attr("d", path)
    .attr("fill", function(d){
      votesForA = d.properties.votesForA;
      votesCast = d.properties.votesCast;
      return globals.colorScale(votesForA / votesCast);
    })
    .attr("class", "districts")
  districts.append("text")
    .attr("transform", function(d) {return "translate(" + projection(d.properties.centerCoords) + ")"; })
    .text(function(d){
      votesForA = d.properties.votesForA;
      votesCast = d.properties.votesCast;
      return globals.format(votesForA / votesCast);
    })
    .attr("class","label");
  }