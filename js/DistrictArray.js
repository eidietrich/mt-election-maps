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