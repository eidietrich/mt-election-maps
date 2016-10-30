// District Array

// Creates an array of shapes/labels for house and senate districts
// Colors them by incumbent party, currently

// pulls from data produced by scripts/district-combine.js

var DistrictArray = function (props){
  this.data = props.data;
  this.element = props.element;
  this.height = props.height;

  // console.log(this.data);
  this.draw()
}
DistrictArray.prototype.draw = function() {
  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;

  this.svg = d3.select(this.element)
    .append('svg')
    .attr("width", this.width)
    .attr("height", this.height)

  // Topology here: Regions (e.g. Western Montana) >> Districts (1 SD & 2 HDs) >> Seat (specific legislative district)

  this.regions = this.svg.selectAll('.region')
    .data(this.data).enter()
    .append('g').attr("class","region")
    .attr("transform", function(d,i) { return "translate(" + 10 + "," + (20 + i * 90) + ")"; });

  this.regions.append('text')
    .text(function(d){ return d.key; });

  this.districts = this.regions.selectAll('.district')
    .data(function(d){ return d.values; }).enter()
    .append('g').attr('class', 'district')
    .attr("transform", function(d,i){ return "translate(" + (50*i) + "," + 20 + ")"; });

  this.senSeats = this.districts.selectAll('.seat senate')
    .data(function(d) { return d.values; }).enter()
    .append('g').attr('class', 'seat senate')
    .attr("transform", "translate(0,0)")
  this.senSeats.append('text')
    .text(function(d) { return d.district; })
    .attr("fill",function(d){ return d.incum_party === 'R' ? "red" : "blue"; });


  this.houseSeats = this.districts.selectAll('.seat house')
    .data(function(d){ return d.house_districts; }).enter()
    .append('g').attr('class','seat house')
    .attr("transform", function(d,i){ return "translate(" + 0 + "," + (20 + 20 * i) + ")"; })
  this.houseSeats.append('text')
    .text(function(d) { return d.district; })
    .attr("fill",function(d){ return d.incum_party === 'R' ? "red" : "blue"; });

}
// DistrictArray.prototype.drawRegion = function(selection, data) {
//   // THIS DOESN'T SEEM TO BE WORKING - MAYBE TRY A DIFFERENT APPROACH
//   console.log(selection);
//   console.log(data);
// }
// DistrictArray.prototype.drawDistrict = function(selection, data) {
//   // draws for a specific district
//   return null;
// }
// DistrictArray.prototype.drawSeat = function(selection, data) {
//   // draws for a specific seat
//   return null
// }


  // Make section for each region

  // For each region, display districts

  // Three stacked squares, (senate district, HDa, HDb)



  // FROM template
  // Make svg


  // // Initialize projection & path
  // var projection = d3.geoMercator()
  //   .fitExtent([[10,10],[this.width, this.height]], this.data);
  // var path = d3.geoPath()
  //   .projection(projection);

  // // Draw map of districts
  // var districts = this.svg.append("g")
  //   .selectAll("path")
  //   .data(this.data.features)
  //   .enter();
  // districts.append("path")
  //   .attr("d", path)
  //   .attr("fill", function(d){
  //     votesForA = d.properties.votesForA;
  //     votesCast = d.properties.votesCast;
  //     return globals.colorScale(votesForA / votesCast);
  //   })
  //   .attr("class", "districts")

  // // Add labels
  // districts.append("text")
  //   .attr("transform", function(d) {return "translate(" + projection(d.properties.centerCoords) + ")"; })
  //   .text(function(d){
  //     votesForA = d.properties.votesForA;
  //     votesCast = d.properties.votesCast;
  //     return globals.format(votesForA / votesCast);
  //   })
  //   .attr("class","label");