// make-test-data.js

/*
Takes zero-vote testing data and returns non-zero vote testing data for 1) partial returns and 2) complete returns

*/

var fs = require('fs');
var util = require('util');

var countyResultsPath = './test/livedata-bycounty-novotes.json';
var raceResultsPath = './test/livedata-byrace-novotes.json';

var countyOutPartialPath = './test/livedata-bycounty-somevotes.json';
var raceOutPartialPath = './test/livedata-byrace-somevotes.json';
var countyOutFullPath = './test/livedata-bycounty-fullvotes.json';
var raceOutFullPath = './test/livedata-byrace-fullvotes.json';

var votesPerPrecinct = 1000;

function readJson(filePath){
  // Read json file synchronously
  var file = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(file);
}
function writeAsJson(filePath, object){
  let json = JSON.stringify(object, null, 2);

  fs.writeFile(filePath, json, function(err){
    if (err) {
      console.log(err);
    }
  });
}
function getRandomInRange(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
COUNTY data structure
 keys: "records", others
  records: array of counties
    each county: "unit_name", candidates array
      each candidate: "candidate_first", "candidate_last", "votes"
*/

var county = readJson(countyResultsPath);
var races = readJson(raceResultsPath);

function giveCountyPartialVotes(countyData){
  countyData.records.forEach(function(county){
    county.races.forEach(function(race){
      var precincts = + race.total_precincts;
      var precinctsIn = getRandomInRange(0,precincts);
      race.num_reporting = precinctsIn;
      var votes = precinctsIn * votesPerPrecinct;
      race.candidates.forEach(function(candidate){
        var votesForThisGuy = getRandomInRange(0,votes);
        candidate.votes = votesForThisGuy;
        votes -= votesForThisGuy;
      });
    });
  });
  writeAsJson(countyOutPartialPath, countyData);
}
giveCountyPartialVotes(county);

function giveCountyFullVotes(countyData){
  countyData.records.forEach(function(county){
    county.races.forEach(function(race){
      var precincts = + race.total_precincts;
      var precinctsIn = precincts;
      race.num_reporting = precinctsIn;
      var votes = precinctsIn * votesPerPrecinct;
      race.candidates.forEach(function(candidate){
        var votesForThisGuy = getRandomInRange(0,votes);
        candidate.votes = votesForThisGuy;
        votes -= votesForThisGuy;
      });
    });
  });
  writeAsJson(countyOutFullPath, countyData);
}
giveCountyFullVotes(county);

/* RACES data structure
  keys: "races", others
  races is array of race objects
    race has keys 'race_id', 'race_name', 'precincts', 'candidates'
      precincts is array of precinct objects {'num_reporting', 'total_precincts', 'unit_name': 'county'}
      candidates is array of candidates with votes {'candidate_first','candidate_last','votes'}
*/

function giveRacesPartialVotes(raceData){
  raceData.races.forEach(function(race){
    var votes = 0;
    race.precincts.forEach(function(precinct){
      var numPrecincts = +precinct.total_precincts;
      var precinctsIn = getRandomInRange(0,numPrecincts);
      votes += precinctsIn * votesPerPrecinct;
      precinct.num_reporting = precinctsIn;
      return precinctsIn;
    });
    race.candidates.forEach(function(candidate){
      var votesForThisGuy = getRandomInRange(0,votes);
      candidate.votes = votesForThisGuy;
      votes -= votesForThisGuy;
    });
  });
  writeAsJson(raceOutPartialPath, raceData);
}
giveRacesPartialVotes(races);

function giveRacesFullVotes(raceData){
  raceData.races.forEach(function(race){
    var votes = 0;
    race.precincts.forEach(function(precinct){
      var numPrecincts = +precinct.total_precincts;
      var precinctsIn = numPrecincts;
      votes += precinctsIn * votesPerPrecinct;
      precinct.num_reporting = precinctsIn;
      return precinctsIn;
    });
    race.candidates.forEach(function(candidate){
      var votesForThisGuy = getRandomInRange(0,votes);
      candidate.votes = votesForThisGuy;
      votes -= votesForThisGuy;
    });
  });
  writeAsJson(raceOutFullPath, raceData);
}
giveRacesFullVotes(races);

console.log('DONE');