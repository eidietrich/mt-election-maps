
// Panel.js

// Renders a list of components into a target container
// components is an array of components of form:
// {'id': 'anchorElement', 'Template': TemplateClassToUse, 'data': dataToPassIn }

var Panel = function (components){

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