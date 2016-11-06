// data-wrangling.js
// Collection of functions for prepping / wrangling data

/* LOGIC

Two vote data sources, counties, and races.

Races is used for race-summary bar charts, as well as for district-based maps and tables for state house/senate district races.

Counties is used for county-based maps and tables in statewide races and ballot initiatives.



*/

// Supplemental info (e.g. party, incumbency)
// TODO: Look at breaking this out into a separate file
var extraCandidateInfo = {
  'mtGov': {
    'BULLOCK': {'party': 'D', 'incumbent': 'yes'},
    'GIANFORTE': {'party': 'R', 'incumbent': 'no'},
    'DUNLAP': {'party': 'L', 'incumbent': 'no'},
  },
  'usRep' : {
    'ZINKE' : {'party': 'R', 'incumbent': 'yes'},
    'JUNEAU': {'party': 'D', 'incumbent': 'no'},
    'BRECKENRIDGE' : {'party': 'L', 'incumbent': 'no'},
  },
  'usPresident': {
    'CLINTON': {'party': 'D', 'incumbent': 'no'},
    'TRUMP': {'party': 'R', 'incumbent': 'no'},
    'JOHNSON': {'party': 'L', 'incumbent': 'no'},
    'STEIN': {'party': 'G', 'incumbent': 'no'},
    'DE LA FUENTE': {'party': 'A', 'incumbent': 'no'},
  },
  'antiTrapping': {
    'YES ON INITIATIVE I-177': {'party': 'Y', 'altName': 'YES'},
    'NO ON INITIATIVE I-177': {'party': 'N', 'altName': 'NO'},
  },
  'medMarijuana': {
    'YES ON INITIATIVE I-182': {'party': 'Y', 'altName': 'YES'},
    'NO ON INITIATIVE I-182': {'party': 'N', 'altName': 'NO'},
  },
};

var partyOrder = ['R','D','L','G','A','Y','N',null]; // Y and N for initiatives

var RACE_IDS = {
  'mtGov': '001450005632',
  'antiTrapping': '002450001213',
  'medMarijuana': '002450001215',
  'usPresident': '001450005633',
  'usRep': '001450005517'
};

function getLastUpdate(){
  // TODO: Write this
  // Will return time of last data refresh
}

function parseCandidates(candidates, raceName){
  // Parsing for candidates arrays, used by several different functions
  // Takes raw list candidates from either race or county source files,
  // pulls in extra data where available and does a bit of other massaging

  var output = candidates.map(function(d){
    var cand = {};
    cand.name = d.candidate_last;
    cand.fullName = d.candidate_first + " " + d.candidate_last;
    cand.party = null;
    cand.incumbent = 'no'
    cand.votes = +d.votes;

    var key = d.candidate_last;
    var extraInfo = extraCandidateInfo[raceName]
    if (key in extraInfo) {
      cand.party = extraInfo[key].party;
      cand.incumbent = extraInfo[key].incumbent;
      // overwrite name for ballot initiatives
      if (extraInfo[key].altName) { cand.name = extraInfo[key].altName; }
    }
    return cand;
  });

  // sort by party
  output.sort(function(a,b){
    return partyOrder.indexOf(a.party) < partyOrder.indexOf(b.party) ? -1 : 1;
  });

  return output;
}

function mergeResultsByCounty(countyGeo, countyResults, raceNames){
  // add results object to countyGeo properties for each raceName in raceNames
  // console.log('mergeResultsIn', countyGeo, countyResults, raceNames)

  raceNames.forEach(function(raceName){
    countyGeo.features.forEach(function(county){
      var countyName = county.properties.NAME;
      county.properties[raceName] = getRaceResults(countyResults, countyName, raceName);
    });
  });

  // console.log('mergeResultsOut', countyGeo);
  return countyGeo;
}
function getRaceResults(countyResults, countyName, raceName){
  // gets results for specific county and race
  var raceId = RACE_IDS[raceName];
  // console.log('getRaceIn', countyResults, countyName)

  var results = {}

  countyResults.records.forEach(function(countyResult){
    // Match to countyName
    if (countyResult.name.toUpperCase() === countyName){
      results.county = countyResult.name;
      countyResult.races.forEach(function(race){
        if (race.race_id === raceId){
          results.candidates = parseCandidates(race.candidates, raceName);
          results.precincts = +race.total_precincts;
          results.precinctsReporting = +race.num_reporting;
        }
      });
    }
  });
  // console.log('getRaceOut', countyName, raceName, results);
  return results;
}

function summarizeRace(_, raceResults, raceName){
  // Takes results by race, returns object for BarGraph.js
  // _ is a placeholder for geodata
  var raceId = RACE_IDS[raceName];

  var results = {};

  var precincts, candidates;
  raceResults.races.forEach(function(race){
    if (race.race_id === raceId){
      precincts = race.precincts;
      candidates = race.candidates;
    }
  });
  var precinctsReporting = 0, totalPrecincts = 0;
  precincts.forEach(function(precinct){
    totalPrecincts += +precinct.total_precincts;
    precinctsReporting += +precinct.num_reporting;
  })
  var totalVotes = 0;
  results.results = parseCandidates(candidates, raceName);
  results.results.forEach(function(result){
    totalVotes += +result.votes;
  })
  results.totalPrecincts = totalPrecincts;
  results.precinctsReporting = precinctsReporting;
  results.totalVotes = totalVotes;

  return results;
}

// OLD, may want to resurrect these functions

// function addRaceToCountyGeoJson(geoJson, countiesForRace, raceName){
//   var geoKey = "NAME",
//     dataKey = "name"

//   var combined = geoJson;
//   combined.features.forEach(function(feature){
//     countiesForRace.counties.forEach(function(county){
//       if (String(county[dataKey]) === String(feature.properties[geoKey])){
//         feature.properties[raceName] = county.candidates;
//         feature.properties.precincts = county.precincts;
//         feature.properties.precinctsReporting = county.precinctsReporting;
//       }
//     });
//   });
//   console.log(combined);
//   return combined;
// }

// function bindFlatToGeoJson(geoJson, data, geoKey, dataKey, includeCols){
//   // Similar to mergeData -- binds "flat" json data (e.g. from a .csv import) to a geoJson object
//   // include cols is an array of fields from the merging data to include

//   var combined = geoJson;
//   combined.features.forEach(function(feature){
//     data.forEach(function(row){
//       if (String(row[dataKey]) === String(feature.properties[geoKey])){
//         includeCols.forEach(function(col){
//           feature.properties[col] = row[col];
//         });
//       }
//     });
//   });
//   return combined;
// }