
// Panel.js

// Renders a list of components into a target container
// components is an array of components of form:
// {'id': 'anchorElement', 'Template': TemplateClassToUse, 'data': dataToPassIn }

var Panel = function (components){

  // Render each chart on respective anchor div
  // console.log('Panel called');

  // Break out of function if components is null
  if (!components) {
    console.log('no panel to render!');
  }

  this.charts = [];
  var that = this;
  components.forEach(function(component, i){
    var spec = {
      'element': document.querySelector('#' + component.id),
      'data': component.data
    }
    // Add anything in component.props to spec
    for (var attr in component.props) { spec[attr] = component.props[attr]}
    that.charts.push(new component.Template(spec));
  });

  // Responsiveness
  window.addEventListener('resize', function(){
    that.charts.forEach(function(chart){
      chart.draw();
    });
  });
}