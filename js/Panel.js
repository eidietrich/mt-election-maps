
// Panel.js

// Renders a list of components into a target container
// components is an array of components of form:
// {'id': 'anchorElement', 'Template': TemplateClassToUse, 'data': dataToPassIn }
//
//
// Will handle data routing in panel object
//

// NOTES: Expects to have d3 available

var Panel = function (components){
  /*
  targetId = css selector for anchor div
  object Array = array of components to render
  */

  // TODO: Add function to check to make sure anchor divs exist, throw error otherwise

  // Render each chart on respective anchor div
  console.log('Panel called');

  // Break out of function if components is null
  if (!components) {
    console.log('no panel to render!')
    return null;
  }

  this.charts = [];
  var that = this;
  components.forEach(function(object, i){
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