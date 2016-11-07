// Universal functions
var globals = {
  toTitleCase(string){
    return string.split(' ').map(function(word){
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    }).join(' ');
  },
  voteFormat: function(vote){
    if (isNaN(vote)) { return ""; }
    else { return d3.format(',')(vote); }
  },
  scale: d3.scaleLinear().range([0,1600]),
  voterScale: function(number){
    // returns radius for proportional area, I think
    return Math.sqrt(this.scale(number));
  },
  colorByParty: d3.scaleOrdinal()
    .domain(['R','D','L','G',
      'A','I','Y','N',null]) // Y and N for initiatives
    .range(['#b2182b',"#2166ac","#ff7f40","#ff7f40",
      "#ff7f40","#666","#018571","#a6611a","#666"]),
  colorByRegion: d3.scaleOrdinal()
    .domain(['Kalispell / Whitefish','Great Falls', 'Billings','Bozeman','Helena','Missoula','Butte / Anaconda'])
    .range(['#b2df8a','#33a02c','#fb9a99','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'])
    .unknown("#bbb"),
  format: d3.format(".0%"),
  // TODO: Tweak these colors
  colorByMarginParty: d3.scaleThreshold()
    .domain([-0.05,-0.02,0.02,0.05])
    .range(['#b2182b','#ef8a62','#998ec3','#67a9cf','#2166ac']),
  colorByMarginReferendum: d3.scaleThreshold()
    .domain([-0.05,-0.02,0.02,0.05])
    .range(['#018571','#80cdc1','#f5f5f5','#dfc27d','#a6611a']),
  raceClassifications: {
    'noData': {'name': 'No data', 'color': "#bbb"},
    'noRaceGOP': {'name': 'No race, GOP incumbent', 'color': "#bbb"},
    'noRaceDEM': {'name': 'No race, Dem incumbent', 'color': "#bbb"},
    'noVotesYet': {'name': 'Not yet counted', 'color': "#666"},
    'uncontestedGOP': {'name': 'Uncontested, GOP', 'color': "#b2182b"},
    'uncontestedDEM': {'name': 'Uncontested, Dem', 'color': "#2166ac"},
    // 'partyRace': {
    //   'name': 'Partisan race',
    //   'color': ,
    // },
    // 'refRace' : {
    //   'name': 'Referendum',
    //   'color': this.,
    // }
  },
  classifyRace: function(raceObject, race) {
    // classifies a county / district based on vote tallies, returns color
    // could modify to include other styling

    // REDUNDANT DECLARATIONS :(
    function getCandidateForParty(candidates, party){
      var match = null;
      candidates.forEach(function(candidate){
        if (candidate.party === party){
          match = candidate;
        }
      });
      return match;
    }
    function totalVotes(objectArray){
      var total = 0;
      objectArray.forEach(function(d){
        total += +d.votes;
      });
      return total;
    }

    if (race === 'mtSen' && raceObject.in_cycle === 'no'){
      // Return incumbent color for out-of-district senate races
      if (raceObject.incum_party === 'R'){
        return globals.raceClassifications['noRaceGOP'].color
      } else if (raceObject.incum_party === 'D') {
        return globals.raceClassifications['noRaceDEM'].color
      } else {
        return globals.raceClassifications['noData'].color
      }
      // return globals.colorByParty(raceObject.incum_party);

    } else if (raceObject.precinctsReporting === 0){
      // Return no results color for < threshold results in
      return globals.raceClassifications['noVotesYet'].color;
    } else if (race === 'medMarijuana' || race === 'antiTrapping') {
      var yes = getCandidateForParty(raceObject.results, 'Y'),
        no = getCandidateForParty(raceObject.results, 'N'),
        diff = (no.votes - yes.votes) / totalVotes(raceObject.results);
      return globals.colorByMarginReferendum(diff);
    } else {
      // Otherwise classify race based on which party is ahead
      var gop = getCandidateForParty(raceObject.results, 'R'),
        dem = getCandidateForParty(raceObject.results, 'D'),
        totalVotes = totalVotes(raceObject.results);
      // TODO: Add logic to check that there isn't an I or L with higher votes

      // handle no data
      if (gop == null && dem == null){
        return globals.raceClassifications['noData'].color;
      }

      // Handle uncontested races
      if (gop == null) {
        return globals.raceClassifications['uncontestedDEM'].color;
      }
      if (dem == null) {
        return globals.raceClassifications['uncontestedGOP'].color;
      }

      var diff = (dem.votes - gop.votes) / totalVotes;
      var color = globals.colorByMarginParty(diff);
      return color;
    }
  }
};