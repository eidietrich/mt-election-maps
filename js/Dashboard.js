// Overall dashboard container object

// SPEC
// Maintains a global data story
// Has 'refresh call' that checks for new data, updates
// Routes into Panel objects

// dataFiles is an array of {variable: 'name', file: 'path', loader: 'd3.csv or d3.json'}
// Panels is an array of panel specs to render

var Dashboard = function (dataFiles, dataJoins, initialPanel) {
  var that = this;
  // initialize state

  this.dataJoins = dataJoins;
  this.currentPanel = initialPanel;
  this.panels = {};

  // initialize data container
  this.dataFiles = dataFiles;
  this.data = {};
  dataFiles.forEach(function(d){
    that.data[d.name] = null;
  });

  // console.log(this.data);
  this.getData(); // collects data and then renders
}
Dashboard.prototype.getData = function(){
  // Collects data from external files
  console.log('getData started');
  var that = this;

  // Build queue to concurrently load all data files
  var queue = d3.queue()
  this.dataFiles.forEach(function(d){
    queue.defer(d.loader, d.file);
  })

  // Once all are loaded, assign contents to data variable and call processData()
  queue.awaitAll(function(error, fileContents){
    if (error) throw error;
    dataFiles.forEach(function(d,i){
      that.data[d.name] = fileContents[i];
    });

    that.processData();
  });
}
Dashboard.prototype.processData = function(){
  // Runs specified data transforms / joins, adding results to data variable
  console.log('processData started')
  var that = this;
  this.dataJoins.forEach(function(d){
    that.data[d.name] = d.functName(that.data[d.geoData], that.data[d.joinData], d.geoKey, d.joinKey, d.includeCols);
  })

  this.render(this.currentPanel);
}
Dashboard.prototype.render = function(panel){
  // Renders panels as specified
  console.log('rendering started')
  var that = this;

  // Bind data for each component
  panel.design.forEach(function(component){
    component.data = that.data[component.data];
  })

  // Render panel of components
  this.panels[panel.name] = new Panel(panel.design);
}