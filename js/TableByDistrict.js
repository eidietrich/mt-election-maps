// Table by county

// Renders a by-county table for given race

var TableByDistrict = function (props){

  this.element = props.element;
  // this.height = props.height;

  // data variables
  this.data = props.data; // input data, as geoJson
  // Supporting text
  this.title = props.title || "";
  this.cutline = props.cutline || "";

  // container for data passed to draw function
  this.tableData = {'columns': [], 'rows': []};
  // supplemental info (e.g. party, incumbency)
  this.candidateKeys = []; // array of candidates, by last name
  this.candidates = []; // array of candidates in race, by info objects

  console.log('TableByDistrict called with', this.data);
  this.shapeData();
  this.draw();
}
TableByDistrict.prototype.shapeData = function() {
  var that = this;

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
  function calcPercent(numer, denom){
    if (denom === 0){ return 'n/a %'; }
    return d3.format(".0%")(numer / denom);
  }
  function makeCandidateCell(candidate, voteTotal){
    if(candidate){
      return candidate.fullName + "<br/>"
        + calcPercent(candidate.votes, voteTotal)
        + " (" + candidate.votes + " votes)";
    } else { return "No candidate" }
  }

  // sort by district number
  this.data.features.sort(function(a,b){
    return +a.properties.number - +b.properties.number;
  });

  this.data.features.forEach(function(feature){
    var properties = feature.properties;
    var results = properties.results;

    if (feature.properties.in_cycle != 'no'){
      var row = {};
      row.values = {
        'precincts': String(properties.totalPrecincts),
        'precinctsReporting': String(properties.precinctsReporting),
        'totalVotes': totalVotes(results, 'votes'),
        'gop': getCandidateForParty(results, 'R'),
        'dem': getCandidateForParty(results, 'D'),
        'other': getCandidateForParty(results, 'L') || getCandidateForParty(results, 'I'),
        'writeIn': getCandidateForParty(results, null),
      };
      row.display = { // Keys here become column headers
        'District': feature.properties.name,
        'Counted':  row.values.precinctsReporting
          + '/' + row.values.precincts + '<br />precincts',
        'Incumbent': properties.incum_name
          + " (" + properties.incum_party+ ")",
        'Republican': makeCandidateCell(row.values.gop, row.values.totalVotes),
        'Democrat': makeCandidateCell(row.values.dem, row.values.totalVotes),
        'Other': makeCandidateCell(row.values.other, row.values.totalVotes)
      };
      that.tableData.rows.push(row);
      that.tableData.columns = Object.keys(row.display);
    }
  });

}
TableByDistrict.prototype.draw = function() {
  var that = this;
  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;

  // Supporting text
  d3.select(this.element).append("h3")
    .html(this.title)
  d3.select(this.element).append("p")
    .html(this.cutline)

  var table = d3.select(this.element)
    .append('table')
    .attr("class", "table");
  var thead = table.append('thead'),
    tbody = table.append('tbody');
  // headers
  thead.append('tr')
    .selectAll('th')
    .data(this.tableData.columns).enter()
    .append('th')
    .html(function(d){ return d; });
  // rows
  var rows = tbody.selectAll('tr')
    .data(this.tableData.rows).enter()
    .append('tr')
  // cells
  // TODO: Figure out how to add selective formatting here
  var cells = rows.selectAll('td')
    .data(function(row, i){
      return that.tableData.columns.map(function(key){ return row.display[key]; });
    }).enter()
    .append("td")
    .html(function(d){ return d; })
}