// ColorMap

// Draws map with color
// (Also works for cartograms when data is provided as a geojson)

// Expects data as a geojson

/* Sample initialization
var senateMap = new ColorMap({
        'element': document.querySelector('#chart2'),
        'data': bindToGeoJson(mtSenDistricts, mtSenData, 'number', 'number',
            ['district', 'incum_party', 'district_label']),
        'aspectRatio': .6
      })
*/

 /*  Possible settings for colorLable and featureLabel:
  colorLabel = function(d) { return globals.colorByParty(d.properties.incum_party) };
  colorLabel = function(d) { return globals.colorByRegion(d.properties.district_label); };
  featureLabel = function(d) { return d.properties.district; };
  */


var ColorMap = function (props){

  this.data = props.data;
  this.race = props.race; // null for house and senate districts
  this.element = props.element;
  this.height = props.height;
  this.heightNotDefined = !props.height;
  this.aspectRatio = props.aspectRatio;

  // console.log('ColorMap called with', this.data);

  // Supporting text
  this.title = props.title || "";
  this.cutline = props.cutline || "";

  // set colorBy and featureLabel props, or default

  if (props.colorBy){
    this.colorBy = props.colorBy;
  } else {
    this.colorBy = "gray";
  }
  if (props.featureLabel) {
    this.featureLabel = props.featureLabel;
  } else {
    this.featureLabel = null;
  }

  this.shapeData()
  this.draw()
}
ColorMap.prototype.shapeData = function(){
  var that = this;
  // Add color
  this.data.features.forEach(function(feature){
    feature.properties.fillColor = globals.classifyRace(feature.properties[that.race], that.race);
  });
}
ColorMap.prototype.draw = function() {
  var that = this;

  this.margin = {top: 30, bottom: 90, right: 20, left: 20};

  d3.select(this.element).html("");
  this.width = this.element.getBoundingClientRect().width;
  if (this.heightNotDefined){
    this.height = this.width * this.aspectRatio
  }

  // adjust bottom margin for no legend on small screens
  if (this.width <= 500) {
    this.margin.bottom = 20;
  }

  this.plotHeight = this.height - this.margin.top - this.margin.bottom;
  this.plotWidth = this.width - this.margin.left - this.margin.right;



  // Supporting text
  d3.select(this.element).append("h3")
    .html(this.title);
  d3.select(this.element).append("p")
    .html(this.cutline);

  this.svg = d3.select(this.element)
    .append('svg')
    .attr("width", this.width)
    .attr("height", this.height);
  this.plot = this.svg.append('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

  // Initialize projection & path
  var projection = d3.geoMercator()
    .fitExtent([[10,10],[this.plotWidth, this.plotHeight]], this.data);
  var path = d3.geoPath()
    .projection(projection);

  // Draw map of districts
  this.districts = this.plot.append("g")
    .selectAll("path")
    .data(this.data.features)
    .enter();
  this.shapes = this.districts.append("path")
    .attr("d", path)
    // .attr("fill", this.colorBy)
    .attr("fill", function(d){ return d.properties.fillColor; })
    .attr("class", "districts")

  // Add text labels
  this.districts.append("text")
    .attr("x", function(d){ return path.centroid(d)[0]; })
    .attr("y", function(d) { return path.centroid(d)[1]; })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(this.featureLabel)

  // Add tooltip
  this.tooltip = this.plot.append("g")
    .attr("id", "tooltip")
    .attr("pointer-events","none")
    .attr("class","hidden")

  function buildTooltip(feature){
    var w = 150, h = 70;
    var centroid = path.centroid(feature);
    var results = feature.properties[that.race];
    // avoid cropping at edges
    var rightOffset  = centroid[0] > that.plotWidth * 0.8 ? -40 : 0,
      leftOffset = centroid[0] < that.plotWidth * 0.2 ? 40 : 0,
      topOffset = centroid[1] < that.plotHeight * 0.2 ? 30 : 0;

    that.tooltip.html("") // clears
    that.tooltip
      .attr("transform", "translate("
        + (centroid[0] + rightOffset + leftOffset) + ","
        + (centroid[1] - 50 + topOffset) + ")")
      .classed("hidden", false)
    that.tooltip.append('circle')
      .attr("r", 3)
      .attr("cy", 50 - topOffset)
      .attr("cx", -rightOffset - leftOffset)
      .attr("fill", "#333")
      .attr("stroke", "#fff")
    that.tooltip.append('rect')
      .attr("width",w)
      .attr("height",h)
      .attr("x",-w / 2)
      .attr('y',-h / 2)
      .attr("fill", "#fff")
      .attr("stroke", "#777")
      .attr("opacity",0.9)
    // Add district / county name
    that.tooltip.append('text')
      .attr("y", -15)
      .attr('text-anchor', 'middle')
      .attr("class", "tooltip-title")
      .style("font-weight", "bold")
      .text(feature.properties.NAME)
    // Add results for first two votes
    var lineOffset = 5;
    results.results.slice(0,2).forEach(function(line){
      that.tooltip.append('text')
        .attr("x", - (w / 2 - 8))
        .attr("y", lineOffset)
        .text(globals.toTitleCase(line.name) + " - "
          + globals.voteFormat(line.votes))
      lineOffset += 20;
    })
    // Add no data label
    if (results.results.length === 0){
      that.tooltip.append('text')
        .attr('text-anchor', 'middle')
        .attr("y", 15)
        .text('No Race / No Data')
    }
  }

  this.shapes
    .on("mouseover", buildTooltip)
  this.shapes
    .on("mouseleave", function(){
      d3.select("#tooltip")
        .classed("hidden", true)
    });

  // Add legend
  // Only if width is >= 500px
  if (this.width >= 500) {
    this.drawLegend();
  }

  // // For testing
  // this.shapes
  //   .on("click", function(d){
  //     console.log(d.properties);
  //   })
}
ColorMap.prototype.drawLegend = function(){
  var that = this;

  var legHeight = 40;
  this.legend = this.svg.append("g")
    .attr("class", "map-legend")
    .attr("transform","translate("
      + (this.margin.left + 20) + ","
      + (this.margin.top + this.plotHeight + 15) + ")")

  var legendDisplay = [], labels; // data variable for legend

  // Add legend items for current colorscale
  // Assumes 5 item color scale
  var colorScale;
  if (this.race === 'medMarijuana' || this.race === 'antiTrapping'){
    labels = ["Yes ahead (>5%)", "Yes leading (2-5%)","Close race (+/-2%)","No leading (2-5%)", "No ahead (>5%)"];
    colorScale = globals.colorByMarginReferendum;
    colorScale.range().forEach(function(d,i){
      legendDisplay.push({
        'label': labels[i],
        'color': d
      });
    });
    // Add some non-standard keys to legend object
    Object.keys(globals.raceClassifications).slice(0,2).forEach(function(key){
    legendDisplay.push({
      'label': globals.raceClassifications[key].name,
      'color': globals.raceClassifications[key].color
    });
  })
  } else {
    labels = ["GOP ahead (>5%)", "GOP leading (2-5%)","Close race (+/-2%)","Dem leading (2-5%)", "Dem ahead (>5%)"];
    colorScale = globals.colorByMarginParty;
    colorScale.range().forEach(function(d,i){
      legendDisplay.push({
        'label': labels[i],
        'color': d
      });
    });
    Object.keys(globals.raceClassifications).forEach(function(key){
      legendDisplay.push({
        'label': globals.raceClassifications[key].name,
        'color': globals.raceClassifications[key].color
      });
    })
  }

  this.legendItems = this.legend.append('g')
    .selectAll('g')
    .data(legendDisplay).enter()
    .append('g')
    .attr("transform", function(d,i) {
      var col = i % 3;
      var row = Math.floor(i / 3);
      return "translate("
        + (col * that.plotWidth / 3) + ","
        + (row * 20) + ")";
    })
  this.legendItems.append("text")
    .attr("x", 12)
    .attr("y", 4)
    .text(function(d){ return d.label; })
  this.legendItems.append("circle")
    .attr("r", 8)
    // .attr("cy", )
    .attr("fill", function(d){ return d.color; })
}