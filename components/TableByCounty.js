// Table by county

// Renders a by-county table for given race

var TableByCounty = function (props){

  this.element = props.element;
  // this.height = props.height;

  // data variables
  this.data = props.data; // input data, as geoJson
  // Supporting text
  this.title = props.title || "";
  this.cutline = props.cutline || "";

  // container for data passed to draw function
  this.race = props.race; // race to display
  this.tableData = {'columns': [], 'rows': []};
  // supplemental info (e.g. party, incumbency)
  this.candidateKeys = []; // array of candidates, by last name
  this.candidates = []; // array of candidates in race, by info objects

  // console.log('TableByCounty called with', this.data);
  this.shapeData();
  this.draw();
}
TableByCounty.prototype.shapeData = function() {
  var that = this;

  function getVotesFor(objectArray, lastName){
    var votes;
    objectArray.forEach(function(d){
      if (d.name === lastName){
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
    if (denom === 0){ return 'n/a %'; }
    return d3.format(".0%")(numer / denom);
  }
  function makeTableArrays(){
    // create arrays of candidates and keys (last name)
    that.data.features.forEach(function(feature){
      feature.properties[that.race].results.forEach(function(candidate){
        var key = candidate.name;
        if (that.candidateKeys.indexOf(key) < 0) {
          that.candidateKeys.push(key);
          that.candidates.push(candidate);
        }
      });
    });
  }
  makeTableArrays();
  // console.log(this.candidateKeys);
  // console.log(this.candidates);

  // sort county data by number of precincts, descending
  this.data.features.sort(function(a,b){
    return b.properties.precincts - a.properties.precincts;
  });

  this.data.features.forEach(function(feature){
    var properties = feature.properties[that.race];

    var row = {};
    // values and display separated here in the hope of making
    // value-specific formatting easier down the line
    row.values = {
      'precincts': String(properties.totalPrecincts),
      'precinctsReporting': String(properties.precinctsReporting),
      'totalVotes': totalOf(properties.results, 'votes'),
    };
    row.display = {
      'County': "<b>" + feature.properties.NAME + "</b><br/>"
        + "<i>" + row.values.precinctsReporting + '/' + row.values.precincts + " precincts</i>",
    };

    // Add values for each candidate
    that.candidateKeys.forEach(function(key){
      var votes = globals.voteFormat(getVotesFor(properties.results, key));
      var percent = getPercentFor(properties.results, key);

      row.values[key + '_votes'] = votes;
      row.values[key + '_percent'] = percent;
      row.display[key] = "<b>" + votes + "</b> votes<br/>(<b>" + percent + "</b>)";
    })

    that.tableData.rows.push(row);
  });
  this.tableData.columns = Object.keys(this.tableData.rows[0].display);

  // limit to 3 candidates
  this.tableData.columns = this.tableData.columns.slice(0,4);

}
TableByCounty.prototype.draw = function() {
  var that = this;
  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;

  d3.select(this.element).append("h3")
    .html(this.title)
  d3.select(this.element).append("p")
    .html(this.cutline)


  var table = d3.select(this.element)
    .append('div').attr("class","table-responsive")
      .append('table')
      .attr("class", "table table-striped");
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