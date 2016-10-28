var Choropleth = function (props, globals){
  this.data = props.data;
  this.element = props.element;
  this.width = props.width;
  this.height = props.height;

  // console.log(this.data.districts);
  // console.log(this.data.votes);

  this.mergeData()
  this.draw()
}
Choropleth.prototype.draw = function() {

  this.svg = d3.select(this.element)
      .append('svg')
      .attr("width", this.width)
      .attr("height", this.height)

  // Initialize projection & path
  var projection = d3.geoMercator()
    .fitExtent([[10,10],[this.width, this.height]], this.data.districts);
  var path = d3.geoPath()
    .projection(projection);

  // Draw map of districts
  var districts = this.svg.append("g")
    .selectAll("path")
    .data(this.data.districts.features)
    .enter();

  districts.append("path")
    .attr("d", path)
    .attr("fill", function(d){
      votesForA = d.properties.votesForA;
      votesCast = d.properties.votesCast;
      return globals.colorScale(votesForA / votesCast);
    })
    .attr("class", "districts")
  districts.append("text")
    .attr("transform", function(d) {return "translate(" + projection(d.properties.centerCoords) + ")"; })
    .text(function(d){
      votesForA = d.properties.votesForA;
      votesCast = d.properties.votesCast;
      return globals.format(votesForA / votesCast);
    })
    .attr("class","label");

  // Add circles, scaled by voter numbers, colored by turnout
  globals.scale.domain(d3.extent(this.data.districts.features, function(d){
    return d.properties.voters;
  }));
  }
Choropleth.prototype.mergeData = function(){
  // Join data on NAME
  var joinLabel = 'NAME';

  var that = this;
  this.data.districts.features.forEach(function(district){
    that.data.votes.forEach(function(d){
      if (d[joinLabel] == district.properties[joinLabel]){
        district.properties.voters = d["reg_voters"];
        district.properties.votesCast = d["votes_cast"];
        district.properties.votesForA = d["tester_votes"];
      };
    });
  });

  // Create centerCoords
  this.data.districts.features.forEach(function(district){
    district.properties.centerCoords = [+district.properties["center_lon"], +district.properties["center_lat"]];
  });
}