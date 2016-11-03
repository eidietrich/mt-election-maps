// Text

// Renders a div with html text
// TODO: Make this use a single string of html stored in props.data
// TODO: Clean up d3 boilerplate

var Text = function (props){
  console.log('Text called');
  this.data = props.data;
  this.element = props.element;
  this.height = props.height;
  this.heightNotDefined = !props.height;
  this.aspectRatio = props.aspectRatio;
  this.margin = {top: 20, bottom: 20, right: 30, left: 30};

  // console.log(this.data);

  this.draw()
}
Text.prototype.draw = function() {

  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;
  if (this.heightNotDefined){
    this.height = this.width * this.aspectRatio
  }
  this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  this.plotWidth = this.width - this.margin.left - this.margin.right;

  this.text = d3.select(this.element)
    .append('div')
    .html('This is text');

  // this.svg = d3.select(this.element)
  //   .append('svg')
  //   .attr("width", this.width)
  //   .attr("height", this.height);
  // this.plot = this.svg.append('g')
  //   .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');


}