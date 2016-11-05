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

## Election app pages

Index has what?

1. /governor - Montana Governor - Bullock v Gianforte v Others
    - County-level choropleth
    - Population-based cartogram (hopefully)
    - Tabulated votes
2. /us-house - Montana U.S. House - Zinke v Juneau v others
    - County-level choropleth
    - Population-based cartogram (hopefully)
    - Tabulated votes
3. /president U.S. President - Clinton v Trump v Others
    - County-level choropleth
    - Population-based cartogram (hopefully)
    - Tabulated votes
4. /mt-house - Montana House
    - House district choropleth
    - House district cartogram
    - Tabulated votes - competitive seats labeled
5. /mt-senate - Montana Senate
    - Senate district choropleth
    - Senate district cartogram
    - Tabulated votes - competitive seats labeled
6. /medical-marijuana - Medical Marijuana - Yes v no
    - County-level choropleth
    - Population-based cartogram (hopefully)
    - Tabulated votes
7. /anti-trapping - Anti-Trapping - Yes v no
    - County-level choropleth
    - Population-based cartogram (hopefully)
    - Tabulated votes
8. /gallatin-county-commission - Gallatin County Commission - Skinner v Leland
    - Gallatin County precinct choropleth
    - Table
9. /law-and-justice Law and Justice - Yes v no on city and county measures
    - Gallatin County precinct choropleth for city
    - Gallatin County precinct choropleth for county
    - Tablulated votes


## Brainstorming

- 10 most competitive house seats - based on 2014 results
- X most competitive senate seats - based on 2014 results

Things to present on election night

Present state-level race
- MT House 
- MT Senate
- Presidential - include libertarian votes (Map third part-votes alone, too)
- Bullock-Gianforte
- Zinke-Juneau
- Medical Marijuana
- Anti-trapping

Gallatin County level
- Leland-Skinner
- L&J
- 

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

Necessary map templates:
- County choropleth (done)
- House District choropleth (done)
- county-scale cartogram (maybe?)
- state-scale cartogram (done, sort of) 



## TODO:
- Add to node-based development environment? (Webpack?)
- Update CircleShadeMap.js for refactored data handling & responsiveness
- Retool DistrictArray.js so it doesn't take hideous data input (have it take multiple files, and move data nesting into the class)
- Delete districts.json (blegh)
- Make choropleth obsolete by adding a custom colorBy function to ColorMap
- Figure out how to work data linkages between house and senate districts
- Remove mergeData (replaced by bindToGeoJson)
- Make house cartogram
- Refine senate cartogram — figure out how to automate the process
- Make local scope map Class (for honing in on particular places)
- Add 'refresh' button to render class
- Make House / Senate district table
- Make county-level data table - TableByCounty.js
- Make house and senate district data table - RaceByDistrict.js
- Make 'control of house/senate' bar graph - ChamberControl.js
- Make 'who's ahead' bar chart  for state-level races and ballot measures
- Figure out how to translate county-level candidate objects into a meaningful color for chart — who's ahead and by how much
- Figure out how to work tooltips and such
- Make temporary 'all precincts' and 'partial precincts' data for testing
- Clean up data-wrangling.js
- TODO: Track down bug where race-filtered data is getting overwritten by the most recently transformed race

Conversation w Becker, Nov 1, pm:
- He'll make dashboard template - with tabs for each race
- I need to make self-contained javascript functions rendering each graphic using data.
- Make a function that generates each tab, pulls in each graph.
- Include an on-tab refresh button that checks for new data, re-renders graphs if there's new data

Workplan:
- Put together tabulations first, then figure out what/how to present in maps

## References

http://ejb.github.io/2016/05/23/a-better-way-to-structure-d3-code.html
