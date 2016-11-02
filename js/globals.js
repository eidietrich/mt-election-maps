// Universal functions
var globals = {
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
  format: d3.format(".0%")
};