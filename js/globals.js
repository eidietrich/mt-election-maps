// Universal functions
var globals = {
  toTitleCase(string){
    return string.split(' ').map(function(word){
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    }).join(' ');
  },
  voteFormat: d3.format(','),
  scale: d3.scaleLinear().range([0,1600]),
  voterScale: function(number){
    // returns radius for proportional area, I think
    return Math.sqrt(this.scale(number));
  },
  colorScale: d3.scaleLinear()
    .domain([0,0.35,0.5,0.65,1])
    .range(["#b2182b","#d6604d","#756bb1","#4393c3","#2166ac"])
    .interpolate(d3.interpolateLab),
  colorByParty: d3.scaleOrdinal()
    .domain(["R","D"])
    .range(["#b2182b", "#2166ac"])
    .unknown("green"),
  colorByRegion: d3.scaleOrdinal()
    .domain(['Kalispell / Whitefish','Great Falls', 'Billings','Bozeman','Helena','Missoula','Butte / Anaconda'])
    .range(['#b2df8a','#33a02c','#fb9a99','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'])
    .unknown("#bbb"),
  format: d3.format(".0%"),
  colorByMargin: d3.scaleThreshold()
    .domain([-0.1,-0.05,-0.01,0.01,0.05,])
    .range(['#2166ac','#67a9cf','#d1e5f0','#998ec3','#fddbc7','#ef8a62','#b2182b']),
  classifyRace: function(feature, scope) {
    // classifies a county / district based on vote tallies, returns color
    // could modify to include other styling
    // console.log('args', feature, scope);

    // TODO: Give up and make a separate one of these for districts and counties

    // scope defines location of race results data (or props)
    var distProps = feature;
    if (scope != null) { distProps = feature[scope]; }

    var threshold = 0.1 // fraction of precincts counted before 'calling' race

    // REDUNDANT DECLARATIONS :( -- Fix
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

    if (distProps.in_cycle === 'no'){
      // case when there are no results, return incumbent
      return globals.colorByParty(distProps.incum_party);
    }
    else if (distProps.totalPrecincts / distProps.precinctsReporting < threshold) {
      return "#666";
    } else {
      var gop = getCandidateForParty(distProps.results, 'R');
      var dem = getCandidateForParty(distProps.results, 'D');
      var totalVotes = totalVotes(distProps.results);
      // TODO: Add logic to check that there isn't an I or L with higher votes

      if (gop == null) { return "#2166ac"; }
      if (dem == null) { return "#b2182b"; }

      var diff = (gop.votes - dem.votes) / totalVotes;
      return globals.colorByMargin(diff);
    }
  }
};