var main = function(){
  // Main function, called at bottom of file here
  dashboard = new Dashboard(dataFiles, dataJoins, panels['home']);
}

var dashboard;

// Array of files for Dashboard to pull in
var dataFiles = [
  // Geodata
  {'name': 'mtSenDistricts', 'file': './../geodata/mt_senate_districts.geojson', 'loader': d3.json},
  {'name': 'mtHouseDistricts', 'file': './../geodata/mt_house_districts.geojson', 'loader': d3.json},
  {'name': 'mtCounties', 'file': './../geodata/mt_counties.geojson', 'loader': d3.json},

  // Static data
  {'name': 'mtSen', 'file': './../data/mt-senate.csv', 'loader': d3.csv},
  {'name': 'mtHouse', 'file': './../data/mt-house.csv', 'loader': d3.csv},

  // Live data
  // TODO: Switch this from test data
  {'name': 'races', 'file': './test/livedata-byrace-fullvotes.json', 'loader': d3.json},
  {'name': 'counties', 'file': './test/livedata-bycounty-fullvotes.json', 'loader': d3.json},

];
var dataJoins = [
  // Array of data processing functions for Dashboard to run on data refresh
  // See data-wrangling.js for function documentation
  {
    'name': 'mtResultsByCounty',
    'functName': mergeResultsByCounty,
    'geoData': 'mtCounties', 'joinData': 'counties',
    'otherArgs': [['mtGov','usPresident','usRep','antiTrapping','medMarijuana']]
  },
  {
    'name': 'mtGovResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['mtGov']
  },
  {
    'name': 'usRepResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['usRep']
  },
  {
    'name': 'usPresResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['usPresident']
  },
  {
    'name': 'antiTrappingResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['antiTrapping']
  },
  {
    'name': 'medMarijuanaResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['medMarijuana']
  },
  {
    'name': 'lAndJCountyResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['lAndJCounty']
  },
  {
    'name': 'lAndJCityResults',
    'functName': summarizeRace,
    'geoData': null, 'joinData': 'races',
    'otherArgs': ['lAndJCity']
  },
  {
    'name': 'mtSenMerged',
    'functName': mergeLegData,
    'geoData': 'mtSenDistricts', 'joinData': 'mtSen',
    'otherArgs': ['mtSen']
  },
  {
    'name': 'mtSenResultsByDistrict',
    'functName': summarizeLegRaces,
    'geoData': 'mtSenMerged', 'joinData': 'races',
    'otherArgs': ['mtSen']
  },
  {
    'name': 'mtHouseMerged',
    'functName': mergeLegData,
    'geoData': 'mtHouseDistricts', 'joinData': 'mtHouse',
    'otherArgs': ['mtHouse']
  },
  {
    'name': 'mtHouseResultsByDistrict',
    'functName': summarizeLegRaces,
    'geoData': 'mtHouseMerged', 'joinData': 'races',
    'otherArgs': ['mtHouse']
  },
];
// var testPanel = {
//   'name': 'test panel',
//   'design': [
//     {'id': 'chart1', 'Template': ColorMap, 'dataVar': 'mtResultsByCounty',
//       'props': {
//         'aspectRatio': 0.6,
//         'race': 'mtGov'
//         }
//       },
//   ]
// };

/*

Each panel object gives Dashboard.js >> Panel.js a list of components to render
'id' is the id for the anchor the component will attach to
'Template' refers to the component class used to create the chart (or text element)
'dataVar' is a string used to reference data stored in Dashboard.data. It should match the name of of either a directly loaded data file in dataFiles above, or a name in dataJoins
'data' (optional) is a way to pass data directly into the component via props.data (may not work currently)
'props' object hands the Template constructor additional properties

*/

var panels = {
  'home': {
    'name': 'home',
    'design': [
      {'id': 'chart1', 'Template': BarGraph, 'dataVar': 'usPresResults',
        'props': {
          'height': 200,
          'title': "Montana's presidential vote",
          'cutline': "Donald Trump (R), Hillary Clinton (D) and others.",
        }
      },
      {'id': 'chart2', 'Template': BarGraph, 'dataVar': 'mtGovResults',
        'props': {
          'height': 150,
          'title': "Montana Governor",
          'cutline': "Incumbent Steve Bullock (D), challengers Greg Gianforte (R) and Ted Dunlap (L).",
        }
      },
      {'id': 'chart3', 'Template': BarGraph, 'dataVar': 'usRepResults',
        'props': {
          'height': 150,
          'title': "Montana's U.S. Representative",
          'cutline': "Incumbent Ryan Zinke (R), challengers Denise Juneau (D) and Rick Breckenridge (L).",
        }
      },
    ]
  },
  'mtGov': {
    'name': 'mtGov',
    'design': [
      {'id': 'chart1', 'Template': BarGraph, 'dataVar': 'mtGovResults',
        'props': {
          'height': 150,
          'title': "Montana Governor",
          'cutline': "Incumbent Steve Bullock (D), challengers Greg Gianforte (R) and Ted Dunlap (L).",
        }
      },
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtResultsByCounty',
        'props': {
          'aspectRatio': 0.8,
          'race': 'mtGov',
          'title': "",
          'cutline': "",
        }
      },
      {'id': 'chart3', 'Template': TableByCounty, 'dataVar': 'mtResultsByCounty',
        'props': {
          'race': 'mtGov',
          'title': "",
          'cutline': ""
        }
      },
    ]
  },
  'usRep': {
    'name': 'usRep',
    'design': [
      {'id': 'chart1', 'Template': BarGraph, 'dataVar': 'usRepResults',
        'props': {
          'height': 150,
          'title': "Montana's U.S. Representative",
          'cutline': "Incumbent Ryan Zinke (R), challengers Denise Juneau (D) and Rick Breckenridge (L).",
        }
      },
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtCounties',
      'props': {
        'aspectRatio': 0.8,
        'race': 'usRep',
      } },
      {'id': 'chart3', 'Template': TableByCounty, 'dataVar': 'mtResultsByCounty',
      'props': {
        'race': 'usRep',
        'extraCandidateInfo': extraCandidateInfo['usRep'],
        'title': "",
        'cutline': ""
      } },
    ]
  },
  'usPresident': {
    'name': 'usPresident',
    'design': [
      {'id': 'chart1', 'Template': BarGraph, 'dataVar': 'usPresResults',
        'props': {
          'height': 200,
          'title': "Montana Presidential vote",
          'cutline': "Donald Trump (R), Hillary Clinton (D) and others.",
        }
      },
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtCounties',
      'props': {
        'aspectRatio': 0.8,
        'race': 'usPresident',
      } },
      {'id': 'chart3', 'Template': TableByCounty, 'dataVar': 'mtResultsByCounty',
      'props': {
        'race': 'usPresident',
        'extraCandidateInfo': extraCandidateInfo['usPresident'],
        'title': "",
        'cutline': ""
      } },
    ]
  },
  'mtSenate': {
    'name': 'mtSenate',
    'design': [
      // ADD MT Senate control
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtSenResultsByDistrict',
      'props': {
        'race': 'mtSen',
        'aspectRatio': 0.8,
        'title': "Montana Senate",
        'cutline': "Montana's upper legislative chamber. Candidates elected to four-year terms, with staggered elections every two years."
        }
      },
      {'id': 'chart3', 'Template': TableByDistrict, 'dataVar': 'mtSenResultsByDistrict',
        'props': {
          'race': 'mtSen',
          'title': "",
          'cutline': ""
        }
      },
    ]
  },
  'mtHouse': {
    'name': 'mtHouse',
    'design': [
      // MT house control
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtHouseResultsByDistrict',
      'props': {
        'race': 'mtHouse',
        'aspectRatio': 0.8,
        'title': "Montana House",
        'cutline': "Montana's lower legislative chamber. Candidates elected to two-year terms."
        }
      },
      {'id': 'chart3', 'Template': TableByDistrict, 'dataVar': 'mtHouseResultsByDistrict',
        'props': {
          'race': 'mtHouse',
          'title': "",
          'cutline': ""
        }
      },
    ]
  },
  'medMarijuana': {
    'name': 'medMarijuana',
    'design': [
      {'id': 'chart1', 'Template': BarGraph, 'dataVar': 'medMarijuanaResults',
        'props': {
          'height': 100,
          'title': "I-182, loosening medical marijuana restrictions",
          'cutline': "Would relax some restrictions on medical marijuana use in Montana.",
        }
      },
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtCounties',
       'props': {
        'aspectRatio': 0.8,
        'race': 'medMarijuana',
        }
      },
      {'id': 'chart3', 'Template': TableByCounty, 'dataVar': 'mtResultsByCounty',
        'props': {
          'race': 'medMarijuana',
          'extraCandidateInfo': {},
          'title': "",
          'cutline': ""
        }
      },
    ]
  },
  'antiTrapping': {
    'name': 'antiTrapping',
    'design': [
      {'id': 'chart1', 'Template': BarGraph, 'dataVar': 'antiTrappingResults',
        'props': {
          'height': 100,
          'title': "I-177, banning trapping on public lands",
          'cutline': "Would generally prohibit the use of traps and snares on public lands in Montana.",
        }
      },
      {'id': 'chart2', 'Template': ColorMap, 'dataVar': 'mtCounties',
       'props': {
        'aspectRatio': 0.8,
        'race': 'antiTrapping',
        'title': "Votes by county",
        'cutline': ""
        }
      },
      {'id': 'chart3', 'Template': TableByCounty, 'dataVar': 'mtResultsByCounty',
        'props': {
          'race': 'antiTrapping',
          'extraCandidateInfo': {},
          'title': "",
          'cutline': ""
        }
      },
    ]
  },
}

main();