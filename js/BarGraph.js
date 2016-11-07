// BarGraph

// expects data in array with following structure:

// var testData = {
//   max: 100,
//   results: [
//     {'name': 'choiceA', 'votes': 45},
//     {'name': 'choiceB', 'votes': 34},
//     {'name': 'choiceC', 'votes': 5}
//   ]
// }

var BarGraph = function (props){
  this.data = props.data;
  this.element = props.element;
  this.height = props.height;
  this.margin = {top: 20, bottom: 20, right: 30, left: 100};

  // Supporting text
  this.title = props.title || "";
  this.cutline = props.cutline || "";

  console.log('BarGraph called with', this.data)
  this.draw()
}
BarGraph.prototype.draw = function() {
  d3.select(this.element).html("");

  // Set up canvas dimensions
  this.width = this.element.getBoundingClientRect().width;
  this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  this.plotWidth = this.width - this.margin.left - this.margin.right;

  // Supporting text
  d3.select(this.element).append("h3")
    .html(this.title);
  d3.select(this.element).append("p")
    .html(this.cutline);

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
  this.yScale = d3.scaleBand()
    .range([0, this.plotHeight])
    .padding(0.3)
    .domain(this.data.results.map(function(d) { return d.name; }));
  this.colorScale = globals.colorByParty;

  // Create axes
  this.xAxis = d3.axisBottom(this.xScale)
    .ticks(10, globals.format);
  this.yAxis = d3.axisLeft(this.yScale);

  this.xGridLines = d3.axisTop(this.xScale)
    .ticks(5)
    .tickSize(-this.plotHeight)
    .tickFormat("");

  // Draw gridlines
  this.plot.append("g")
    .attr("class","grid")
    .call(this.xGridLines)

  // Draw bars
  var that = this;
  this.bars = this.plot.append("g")
    .selectAll('.bar')
    .attr("class","bar")
    .data(this.data.results).enter();
  this.bars.append("rect")
    .attr("fill", function(d){ return that.colorScale(d.party); })
    .attr("x", 0)
    .attr("y", function(d){ return that.yScale(d.name); })
    .attr("width", function(d){
      if (that.data.totalVotes === 0) { return that.xScale(0); }
      else { return that.xScale(d.votes / that.data.totalVotes); }
     })
    .attr("height", that.yScale.bandwidth());

  // Add vote numbers
  this.bars.append('text')
    .attr("y", function(d){
      return that.yScale(d.name)
        + that.yScale.bandwidth() / 2 + 5; })
    .attr("x", function(d){
      if (that.data.totalVotes === 0) { return that.xScale(0) + 3; }
      else { return that.xScale(d.votes / that.data.totalVotes) + 3; }
     })
    .text(function(d){ return globals.voteFormat(d.votes) + " votes"; })

  // Draw axes
  this.plot.append("g")
    .attr("transform", "translate(" + 0 + "," + this.plotHeight + ")")
    .call(this.xAxis);
  this.plot.append("g")
    .call(this.yAxis);

}