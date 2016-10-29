// Opposing Bar Graph
// Presents top two vote-getting choices in opposition

// expects data in array with following structure:

// var testData = {
//   max: 100,
//   results: [
//     {'name': 'choiceA', 'votes': 45},
//     {'name': 'choiceB', 'votes': 34},
//     {'name': 'choiceC', 'votes': 5}
//   ]
// }

var OpposingBarGraph = function (props){
  this.data = props.data;
  this.element = props.element;
  this.height = props.height;
  this.margin = {top: 20, bottom: 20, right: 20, left: 20};
  this.innerMargin = 15; // space between axis and bar

  this.draw()
}
OpposingBarGraph.prototype.draw = function() {
  d3.select(this.element).html("");

  // Filter to top two results
  // Assuming first two are top two
  // this.data.results.sort(function(a,b){
  //   return b.votes - a.votes;
  // });
  this.data.results = this.data.results.slice(0,2)

  // Set up canvas dimensions
  this.width = this.element.getBoundingClientRect().width;
  this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  this.plotWidth = this.width - this.margin.left - this.margin.right;

  // Make svg & plot area
  this.svg = d3.select(this.element)
      .append('svg')
      .attr("width", this.width)
      .attr("height", this.height)
  this.plot = this.svg.append('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

  // Create scales
  this.xScale = d3.scaleLinear()
    .range([0, this.plotWidth])
    .domain([0, 1]);
  this.colorScale = d3.scaleOrdinal()
    .domain(this.data.results.map(function(d) { return d.name; }))
    .range(["#b2182b","#2166ac","#31a354"])

  // Create axes
  this.xAxis = d3.axisBottom(this.xScale)
    .ticks(10, globals.format);
  this.xGridLines = d3.axisTop(this.xScale)
    .ticks(5)
    .tickSize(-this.plotHeight)
    .tickFormat("");

  // Draw gridlines
  this.plot.append("g")
    .attr("class","grid")
    .call(this.xGridLines)

  // Draw left bar
  var bar = this.data.results[0];
  this.plot.append("rect")
    .attr("class","bar")
    .attr("fill", this.colorScale(bar.name))
    .attr("x", 0)
    .attr("width", this.xScale(bar.votes / this.data.max))
    .attr("y", this.innerMargin)
    .attr("height", this.plotHeight - 2 * this.innerMargin);

  // Draw right bar
  bar = this.data.results[1];
  this.plot.append("rect")
    .attr("class","bar")
    .attr("fill", this.colorScale(bar.name))
    .attr("x", this.plotWidth - this.xScale(bar.votes / this.data.max))
    .attr("width", this.xScale(bar.votes / this.data.max))
    .attr("y", this.innerMargin)
    .attr("height", this.plotHeight - 2 * this.innerMargin);

  // Draw axes
  this.plot.append("g")
    .attr("transform", "translate(" + 0 + "," + this.plotHeight + ")")
    .call(this.xAxis);
}