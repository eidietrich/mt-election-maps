var width = 500, height = 400;

    var svg = d3.select('#map')
      .append('svg')
      .attr("width", width)
      .attr("height", height)



    var scale = d3.scaleLinear()
      .range([0,1600]);
    var voterScale = function(number){
      // returns radius for proportional area, I think
      return Math.sqrt(scale(number));
    }

    var colorScale = d3.scaleLinear()
      .domain([0,0.35,0.5,0.65,1]) // Fraction vote for Obama in 2012
      .range(["#b2182b","#d6604d","#756bb1","#4393c3","#2166ac"])
      .interpolate(d3.interpolateLab);

    var format = d3.format(".0%");

    d3.json('./../data/mt-counties-simplified.geojson', function(data){

      // console.log(data);

      var projection = d3.geoMercator()
        .fitExtent([[10,10],[width, height]], data);

      var path = d3.geoPath()
        .projection(projection);

      svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county");

        d3.json('./../data/2012-election-points.geojson', function(points) {
          scale.domain(d3.extent(points.features, function(d){
            return d.properties['reg_voters'];
          }));

          circles = svg.append("g")
            .selectAll('.circles')
            .data(points.features)
            .enter();

          circles.append("circle")
            .attr("transform", function(d) {return "translate(" + projection(d.geometry.coordinates) + ")"; })
            .attr("r", function(d) {
              return voterScale(d.properties['reg_voters']) } )
            .attr("fill", function(d){
              testerVotes = d.properties['tester_votes'];
              votesCast = d.properties['votes_cast'];
              return colorScale(testerVotes / votesCast);
            })
            .attr("class", "circle");

          circles.append("text")
            .attr("transform", function(d) {return "translate(" + projection(d.geometry.coordinates) + ")"; })
            .text(function(d){
              testerVotes = d.properties['tester_votes'];
              votesCast = d.properties['votes_cast'];
              return format(testerVotes / votesCast);
            })
            .attr("class","label");


        })

    });