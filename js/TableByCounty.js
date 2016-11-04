// Table by county

// Renders county level data for races
// this.data = geoJson with prop.candidates array

/*
Columns:
- County name
- Precincts counted
- R candidate name
- D candidate name
- R vote percent
- D vote percent
- Other vote names / percent?

Other info to communicate: is one candidate the incumbent?
Libertarian candidates?
*/

var candidates = [
  {'name': 'ZINKE', 'party': 'R', 'incumbent': 'yes'},
  {'name': 'JUNEAU', 'party': 'R', 'incumbent': 'no'},
  {'name': 'BRECKENRIDGE', 'party': 'L', 'incumbent': 'no'},
];

var TableByCounty = function (props){
  this.data = props.data;
  this.element = props.element;
  // this.height = props.height;

  console.log(this.data);
  this.shapeData();
  this.draw();
}
TableByCounty.prototype.shapeData = function() {
  function getVotesFor(objectArray, lastName){
    var votes;
    objectArray.forEach(function(d){
      // console.log(d.candidate_last, lastName);
      if (d.candidate_last === lastName){
        votes = +d.votes;
      }
    });
    // console.log('toreturn', votes);
    return votes;
  }
  function getPercentFor(objectArray, lastName){
    return calcPercent(
      getVotesFor(objectArray, lastName),
      totalOf(objectArray, 'votes'));
  }
  function totalOf(objectArray, key){
    var total = 0;
    objectArray.forEach(function(d){
      total += +d[key];
    });
    return total;
  }
  function calcPercent(numer, denom){
    if (denom === 0){ return 'n/a'; }
    return numer / denom;
  }

  var that = this;

  // sort county data by number of precincts, descending
  this.data.features.sort(function(a,b){
    return b.properties.precincts - a.properties.precincts;
  });

  this.tableData = {};
  this.tableData.rows = [];
  this.data.features.forEach(function(feature){
    var properties = feature.properties;
    var candidates = properties.candidates;
    // console.log(candidates)
    // console.log('result', getVotesFor(candidates, 'ZINKE'))

    var row = {
      'County': feature.properties.NAME,
      'Precincts Counted': String(properties.precinctsReporting) + '/' + String(properties.precincts),
      'Zinke votes': getVotesFor(candidates, 'ZINKE'),
      'Zinke percent': getPercentFor(candidates, 'ZINKE'),
      'Juneau votes': getVotesFor(candidates, 'JUNEAU'),
      'Juneau percent': getPercentFor(candidates, 'JUNEAU')
    };
    that.tableData.rows.push(row);
  });
  this.tableData.columns = Object.keys(this.tableData.rows[0]);



}
TableByCounty.prototype.draw = function() {
  var that = this;
  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;

  var table = d3.select(this.element)
    .append('table')
    .attr("classs", "table");
  var thead = table.append('thead'),
    tbody = table.append('tbody');
  // headers
  thead.append('tr')
    .selectAll('th')
    .data(this.tableData.columns).enter()
    .append('th')
    .text(function(d){ return d; });
  // rows
  var rows = tbody.selectAll('tr')
    .data(this.tableData.rows).enter()
    .append('tr')
  var cells = rows.selectAll('td')
    .data(function(row, i){
      return that.tableData.columns.map(function(key){ return row[key]; });
    })
    .enter()
    .append("td")
    .text(function(d){ return d; })
}

/* Table data object, ideal form
- columns
- rows
- - {columnName: value } - [countyName ]

*/