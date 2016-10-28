var MapGen = function (props, globals){
  this.data = props.data;
  this.element = props.element;
  this.width = props.width;
  this.height = props.height;

  console.log(this.data.counties);
  console.log(this.data.votes);

  this.draw()
}
MapGen.prototype.draw = function() {

  this.svg = d3.select(this.element)
      .append('svg')
      .attr("width", this.width)
      .attr("height", this.height)

  // Initialize projection
  var projection = d3.geoMercator()
    .fitExtent([[10,10],[this.width, this.height]], this.data.counties);
  var path = d3.geoPath()
    .projection(projection);

  // Join data on NAME
  var that = this;
  this.data.counties.features.forEach(function(county){
    that.data.votes.forEach(function(d){
      if (d['NAME'] == county.properties['NAME']){
        county.properties.voters = d["reg_voters"];
        county.properties.votesCast = d["votes_cast"];
        county.properties.votesForA = d["tester_votes"];
      };
    });
  });

  // Create center_coords
  this.data.counties.features.forEach(function(county){
    county.properties.centerCoords = [+county.properties["center_lon"], +county.properties["center_lat"]];
  });

  console.log(this.data.counties);



  // Draw counties
  this.svg.append("g")
    .selectAll("path")
    .data(this.data.counties.features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "county");

  // Add circles, scaled by voter numbers, colored by turnout
  globals.scale.domain(d3.extent(this.data.counties.features, function(d){
    return d.properties.voters;
  }));

  var that = this;
  circles = this.svg.append("g")
    .selectAll('.circles')
    .data(this.data.counties.features)
    .enter();

  circles.append("circle")
    .attr("transform", function(d) {return "translate(" + projection(d.properties.centerCoords) + ")"; })
    .attr("r", function(d) {
      return globals.voterScale(d.properties.voters) } )
    .attr("fill", function(d){
      votesForA = d.properties.votesForA;
      votesCast = d.properties.votesCast;
      return globals.colorScale(votesForA / votesCast);
    })
    .attr("class", "circle");

  circles.append("text")
    .attr("transform", function(d) {return "translate(" + projection(d.properties.centerCoords) + ")"; })
    .text(function(d){
      votesForA = d.properties.votesForA;
      votesCast = d.properties.votesCast;
      return globals.format(votesForA / votesCast);
    })
    .attr("class","label");
  }

MapGen.prototype