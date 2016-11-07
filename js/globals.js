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
    .range(['#b2182b',"#2166ac","#a6611a","#a6611a",
      "#a6611a","#a6611a","#1a9641","#d7191c","#a6611a"]),
  colorByRegion: d3.scaleOrdinal()
    .domain(['Kalispell / Whitefish','Great Falls', 'Billings','Bozeman','Helena','Missoula','Butte / Anaconda'])
    .range(['#b2df8a','#33a02c','#fb9a99','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'])
    .unknown("#bbb"),
  format: d3.format(".0%"),
  // TODO: Tweak these colors
  colorByMarginParty: d3.scaleThreshold()
    .domain([-0.05,-0.02,0.02,0.05])
    .range(['#b2182b','#ef8a62','#756bb1','#67a9cf','#2166ac']),
  colorByMarginReferendum: d3.scaleThreshold()
    .domain([-0.05,-0.02,0.02,0.05])
    .range(['#1a9641','#91cf60','#a6611a','#fc8d59','#d7191c']),
  raceClassifications: {
    'noVotesYet': {'name': 'Not yet counted', 'color': "#dfc27d"},
    'noRace': {'name': 'No race this year', 'color': "#ddd"},
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
      return globals.raceClassifications['noRace'].color;
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
        return '#777';
      }

      // Handle uncontested races, inelegantly
      if (gop == null) {
        return "#2166ac";
      }
      if (dem == null) {
        return "#b2182b";
      }

      var diff = (dem.votes - gop.votes) / totalVotes;
      var color = globals.colorByMarginParty(diff);
      return color;
    }
  }
};