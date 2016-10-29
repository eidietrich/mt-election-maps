// district-combine.js

/*
Combines .csv data from house and senate districts into a combined json

Desired format

- Districts (at the senate level)
 - SD data
 - HD data
  + HD1
  + HD2

*/

// Imports
var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var d3 = require('d3');

// File paths
var joinFile = './raw_data/mt-hd-sd-joins.csv'
var senateFile = './raw_data/senate-data.csv'
var houseFile = './raw_data/house-data.csv'

var outFile = './data/districts.json';

function writeAsJson(filePath, object){
  let json = JSON.stringify(object, null, 2);

  fs.writeFile(filePath, json, function(err){
    if (err) {
      console.log(err);
    }
  });
  // console.log('wrote', object, 'to', filePath);
}
function readCsv(filePath){
  // Reads csv file synchronously, parses into array of objects
  data = fs.readFileSync(filePath, 'utf-8');
  return parse(data, {columns: true});
}
function getHDforSD(district){
  // returns contents of house district array for given senate district in "SD 4" format
  // Relies on join and house global variables.

  var returnDists = [];
  var returnData = [];

  // Get both house districts that correspond to the senate district
  join.forEach(function(join){
    if (join['SD'] === district){
      returnDists.push(join['HD']);
    }
  });
  // Get data for those house districts
  house.forEach(function(hd){
    if (returnDists.indexOf(hd.district) > -1){
      returnData.push(hd);
    }
  });
  return returnData;
}

var join = readCsv(joinFile);
var senate = readCsv(senateFile);
var house = readCsv(houseFile);

// Nest by region and senate district
var nested = d3.nest()
  .key(function(d) { return d.district_label; })
  .key(function(d) { return d.district; })
  .entries(senate);

// Add house district data
nested.forEach(function(region){
  region.values.forEach(function(sd){
    sd.values.forEach(function(value){
      sd.house_districts = getHDforSD(value.district);
    })

  });
});

writeAsJson(outFile, nested);
