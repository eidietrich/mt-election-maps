var CircleShadeMap = function (props, globals){
  this.data = props.data;
  this.element = props.element;
  this.width = props.width;
  this.height = props.height;

  // console.log(this.data.districts);
  // console.log(this.data.votes);

  this.mergeData()
  this.draw()
}
CircleShadeMap.prototype.draw = function() {

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
  this.svg.append("g")
    .selectAll("path")
    .data(this.data.districts.features)
    .enter().append("path")
    .attr("d", path)
    .attr("fill", "#bbb")
    .attr("class", "districts");

  // Add circles, scaled by voter numbers, colored by turnout
  globals.scale.domain(d3.extent(this.data.districts.features, function(d){
    return d.properties.voters;
  }));

  var that = this;
  circles = this.svg.append("g")
    .selectAll('.circles')
    .data(this.data.districts.features)
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

CircleShadeMap.prototype.mergeData = function(){
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