/*
Gets race ids from races file
*/

var fs = require('fs');

function readJson(filePath){
  // Read json file synchronously
  var file = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(file);
}

var racesPath = './test/livedata-byrace-novotes.json';
var raceFile = readJson(racesPath);

raceFile.races.forEach(function(race){
  console.log(race.race_name + ',' + race.race_id);
})