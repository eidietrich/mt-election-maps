# Visualizing Montana's politics

Sandbox for building d3 visualizations to display Montana / Gallatin County election data

Structured (currently) as an index.html entrance point that pulls in different map types as self-contained classes from independent files.

## Data structure

- Geographies (stored as geojson)
    + MT Counties (feature key = "NAME")
    + MT House Districts (feature key = 'number')
    + MT Senate Districts (feature key = 'number')
    + Gallatin County precincts (feature key = 'PRECINCT')
    + MT Senate District cartogram (feature key = 'sd')
    + (TODO) MT House District cartogram (feature key = ??)
    + (Possible TODO) MT County cartogram

- Non geographic static data
    + 2012 county-level election data
    + placeholder GC precinct-level data
    + Senate district info (e.g incumbents)
    + House district info (e.g. incumbents)

- Potentially dynamic data
    + Waiting on Becker's work with AP election API

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
- state-scale cartogram (done, sort of) 


## TODO:
- Add to node-based development environment? (Webpack?)
- Update CircleShadeMap.js for refactored data handling & responsiveness
- Retool DistrictArray.js so it doesn't take hideous data input (have it take multiple files, and move data nesting into the class)
- Delete districts.js (blegh)
- Break colorBy and featureLabel functions out of ColorMap global space into props
- Make choropleth obsolete by adding a custom colorBy function to ColorMap
- Figure out how to work data linkages between house and senate districts
- Remove mergeData (replaced by bindToGeoJson)
- Make house cartogram
- Refine senate cartogram — figure out how to automate the process
- Make local scope map Class (for honing in on particular places)


## References

http://ejb.github.io/2016/05/23/a-better-way-to-structure-d3-code.html
