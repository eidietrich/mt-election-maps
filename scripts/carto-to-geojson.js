// carto-to-geojson.js

/*
Takes hand-crafted .json for senate district cartogram and converts it into a geojson spec.

POSSIBLE ADDITION: Set this up so it scales the resultng coordinates to an equivalent frame for Montana
*/

var fs = require('fs');

var cartoFile = './raw_data/mt-sen-carto-coords.json';

var outFile = './geodata/sen-carto.geojson';

var geoJson = {
  "type": "FeatureCollection",
  "features": []
}

var shapeWidth = 1.0; // Non-1 to provide a buffer between shapes

function writeAsJson(filePath, object){
  let json = JSON.stringify(object, null, 2);

  fs.writeFile(filePath, json, function(err){
    if (err) {
      console.log(err);
    }
  });
  // console.log('wrote', object, 'to', filePath);
}

function readJson(filePath){
  // Read json file synchronously
  var file = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(file);
}

function makeFeature(object){
  feature = { "type": "Feature"};
  feature.geometry = {
    "type": "Polygon",
    "coordinates": [coordsToCoords(object.coords)]
  };

  feature.properties = {
    "sd": object.sd,
    "origCoords": object.coords,
    "newCoords": coordsToCoords(object.coords)
  };

  return feature;
}

function coordsToCoords(coords){
  // converts .json psuedo-cords to geoJson-suitable cordinates



  // [[x1,y1],[x2,y2]], representing tiles covered by shape
  // This code may assume x1,y1 is the smaller point

  p = {
    x1: coords[0][0],
    y1: coords[0][1],
    x2: coords[1][0],
    y2: coords[1][1]
  }

  // Vertical invert, because I used a (0,0) in top-left grid previously and lat/long coordinates work (0,0) in lower-left
  var max = 8 // THIS IS A TRAP FOR LATER-SELF
  p.y1 = 0 - p.y1;
  p.y2 = 0 - p.y2;

  // Ensure p1 is closer to origin
  if (p.x1 > p.x2 || p.y1 > p.y2) {
    var a = [p.x1, p.y1];
    p.x1 = p.x2;
    p.y1 = p.y2
    p.x2 = a[0];
    p.y2 = a[1];
  }

  var corners = {
    downLeft: [p.x1, p.y1],
    upLeft: [p.x1, p.y2 + shapeWidth],
    upRight: [p.x2 + shapeWidth, p.y2 + shapeWidth],
    downRight: [p.x2 + shapeWidth, p.y1]
  }

  return [corners.downLeft, corners.upLeft, corners.upRight, corners.downRight, corners.downLeft];

}

var json = readJson(cartoFile);

json.forEach(function(item) {
  geoJson.features.push(makeFeature(item));
});

writeAsJson(outFile, geoJson);
console.log('DONE');