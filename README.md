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


## TODO:
- Refactor data merge out of individual map type classes
- Add aggregate vote count bars (think through bond measures versus 2-way, 3-way races, etc.)
- Brainstorm other diagram types
- Look at cartograms?
- Add to node-based development environment?
- Switch to local d3 script
- Update CircleShadeMap.js for refactored data handling
- Add responsiveness to base template

## References

http://ejb.github.io/2016/05/23/a-better-way-to-structure-d3-code.html
