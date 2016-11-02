
// Panel.js

// Renders a list of objects into a target container
// TODO: Figure out how to route data loading/processing
// TODO: Adjust this so it can render charts onto id divs instead of in initially given container

// NOTES: Expects to have d3 available

var Panel = function (target, objects){
  /*
  targetId = css selector for anchor div
  object Array = array of objects to render
  */

  this.mainAnchor = document.querySelector(target);
  this.element = d3.select(this.mainAnchor);

  this.element.html("") // TODO: Change this to allow binding to existing layout elements

  this.charts = [];

  var that = this;
  objects.forEach(function(object, i){
    this.element.append('div')
      .attr("id", object.id);
    that.charts.push(new object.Template({
      'element': document.querySelector('#' + object.id),
      'data': object.data,
      'aspectRatio': 0.6
    }));
  });

  // Responsiveness
  window.addEventListener('resize', function(){
    that.charts.forEach(function(chart){
      chart.draw();
    });
  });
}