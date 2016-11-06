// Overall dashboard container object

// SPEC
// Maintains a global data story
// Has 'refresh call' that checks for new data, updates (TODO)
// Routes into Panel objects

// dataFiles is an array of {variable: 'name', file: 'path', loader: 'd3.csv or d3.json'}

// initialPanel is the first panel to render
// Expected usage is calling dashboardName.render(panel) from index on panel change

var Dashboard = function (dataFiles, dataJoins, initialPanel) {
  var that = this;

  this.dataJoins = dataJoins;
  this.currentPanel = initialPanel;
  this.panels = {};

  // initialize data container
  this.dataFiles = dataFiles;
  this.data = {};
  dataFiles.forEach(function(d){
    that.data[d.name] = null;
  });
  this.addRefreshButton();
  this.getData(); // collects data and then renders
}
Dashboard.prototype.addRefreshButton = function(){
  // Adds refresh button
  var refresh = d3.select("#refresh-container")
    .insert('div', ':first-child') // at top of container

  refresh.append('button')
    .attr("class", "btn btn-default")
    .text('Refresh')
    // HACK: assumes dashboard name is dashboard
    .attr("onclick","dashboard.handleRefresh()")
}
Dashboard.prototype.handleRefresh = function(){
  // runs getData >> processData >> render(this.panel) pathway again
  this.getData();
}
Dashboard.prototype.getData = function(){
  // Collects data from external files
  // console.log('getData started');
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
  // Runs specified data transforms / joins, adding results to data object

  function applyDataJoin(d){
    // Helper function for unpacking arguments into join function
    var functName = d.functName,
      geoData = that.data[d.geoData],
      joinData = that.data[d.joinData],
      otherArgs = d.otherArgs;
    var args = [geoData, joinData].concat(otherArgs);
    return functName.apply(this, args);
  }

  var that = this;
  this.dataJoins.forEach(function(dataJoin){
    that.data[dataJoin.name] = applyDataJoin(dataJoin);
  })

  console.log('dashboard data', this.data);
  this.render(this.currentPanel);
}
Dashboard.prototype.render = function(panel){
  // Renders panels as specified
  var that = this;

  // Bind data for each component
  panel.design.forEach(function(component){
    component.data = that.data[component.dataVar];
  })

  // Render panel of components
  console.log('rendering', panel.name)
  this.panels[panel.name] = new Panel(panel.design);
}