// data-wrangling.js
// Collection of functions for prepping / wrangling data

function mergeData (geoJson, joinData, joinKey, dims) {
  // Takes geojson spatial data object and performs a left merge from joinData array
  // Assumes geojson.properties has "center_lon" and "center_lat" centroid fields
  // Returns merged geojson object

  // To look at: Add filtering here?

  var outGeoJson = geoJson;

  // shift centroid coordinates to centerCoords array
  // NOTES: THIS ISN'T REALLY NECESSARY b/c of D3's "path.centroid" function
  outGeoJson.features.forEach(function(district){
    district.properties.centerCoords = [+district.properties["center_lon"], +district.properties["center_lat"]];
  });

  // Perform merge
  outGeoJson.features.forEach(function(district){
    joinData.forEach(function(d){
      if (d[joinKey] == district.properties[joinKey]){
        district.properties.voters = d[dims.voters];
        district.properties.votesCast = d[dims.votesCast];
        district.properties.votesForA = d[dims.toPlot];
      }
    });
  });

  return outGeoJson;
}
function bindToGeoJson(geoJson, data, geoKey, dataKey, includeCols){
  // Similar to mergeData -- binds "flat" json data (e.g. from a .csv import) to a geoJson object
  // include cols is an array of fields from the merging data to include
  var combined = geoJson;
  combined.features.forEach(function(feature){
    data.forEach(function(row){
      if (String(row[dataKey]) === String(feature.properties[geoKey])){
        includeCols.forEach(function(col){
          feature.properties[col] = row[col];
        });
      }
    });
  });
  return combined;
}
function prepForBar (data, maxDim, issueArray) {
  // THIS IS HALF-FUNCTIONAL
  // Use d3 rollup here?
  // Produce object for BarGraph class to plot
  // Form of:
  // var preppedData = {
  //   max: 100,
  //   results: [
  //     {'name': 'issueA', 'votes': 45},
  //     {'name': 'issueB', 'votes': 34},
  //     {'name': 'issueC', 'votes': 5}
  //   ]
  // }

  // For summing values
  var sum = function(items, prop){
    return items.reduce(function(a, b){
      return a + b[prop];
    }, 0);
  };

  var preppedData = {
    'max': null,
    'results': []
  };

  preppedData.max = sum(data, maxDim);
  issueArray.forEach(function(name){
    preppedData.results.push({
      "name": name,
      "votes": sum(data, name)});
  })
  return preppedData;
}