
// Panel.js

// Renders a list of objects into a target container
// objects is an array of objects of form:
// {'id': 'anchorElement', 'Template': TemplateClassToUse, 'data': dataToPassIn }
//
//
// TODO: Figure out how to route data loading/processing
//

// NOTES: Expects to have d3 available

var Panel = function (objects){
  /*
  targetId = css selector for anchor div
  object Array = array of objects to render
  */

  this.charts = [];

  var that = this;
  objects.forEach(function(object, i){
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