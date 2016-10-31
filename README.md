# Montana Elections

Sandbox for building d3 visualizations to display Montana / Gallatin County election data

Structured (currently) as an index.html entrance point that pulls in different map types as self-contained classes from independent files.

## Setup

Geographies:
- Montana Counties --> Key = County name (all caps) 'NAME'
- Gallatin County precincts --> key = 'PRECINCT'
- (TODO) Montana House Districts
- (TODO) Montana Senate Districts (aggregated House Districts)


Filler data: 
- County-level vote tallies
- Gallatin County precincts
- (TODO) Other geographies

## Brainstorming

Need to think about how to represent partial vote counts (easier with a cartogram or other diagram?)

Look at scaling counties by population for one view?

Important issues at a county level:
- L&J Bond (city and county measures)
- Skinner-Leland
- Local house/senate races?

Important at a state level
- Gov Race
    + County or HD-level map
- U.S. House Race
- MT House & Senate power balances (even if nothing's going to change)

Necessary templates:
- County choropleth (done)
- House District choropleth (done)
- county-scale cartogram (maybe?)
- state-scale cartogram (use House Districts, since they're roughly equal pop) 

Data structure for house district-level display

Senate district
GeoJSON, with a properties: "HD" link to House District

District
- Senate district
    + SD
- House districts
    + HD1
    + HD2

## Data structure

- Geographies
    + MT Counties --> GeoJSON (feature key = ??)
    + MT House Districts --> GeoJSON (feature key = ??)
    + MT Senate Districts --> GeoJSON (feature key = ??)
    + Gallatin County precincts --> GeoJSON (feature key = ??)
    + MT Senate District cartogram --> (TODO: Transform to pseudo-geoJSON) (feature key = ??)
    + MT House District cartogram (feature key = ??)
    + (Possibly TODO) MT County cartogram

NB: Geographies also need to have centroid coordinates included in properties fields for labeling and such
OR implement bounding box center solution from here: http://stackoverflow.com/questions/12062561/calculate-svg-path-centroid-with-d3-js

- Non geographic static data
    + 2012 county-level election data
    + fake GC precinct-level data
    + 

- Potentially dynamic data
    + Waiting on Becker's work with AP election API

## TODO:
- Brainstorm other diagram types
- Look at cartograms?
- Add to node-based development environment? (Webpack?)
- Update CircleShadeMap.js for refactored data handling & responsiveness


## References

http://ejb.github.io/2016/05/23/a-better-way-to-structure-d3-code.html
