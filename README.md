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

## TODO:
- Brainstorm other diagram types
- Look at cartograms?
- Add to node-based development environment? (Webpack?)
- Update CircleShadeMap.js for refactored data handling & responsiveness


## References

http://ejb.github.io/2016/05/23/a-better-way-to-structure-d3-code.html
