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
8. /law-and-justice Law and Justice - Yes v no on city and county measures
    - Gallatin County precinct choropleth for city
    - Gallatin County precinct choropleth for county
    - Tablulated votes


ON-DEADLINE BUG TRACKING
- Have Troy look at this, make sure it works

## NEXT-STEP REFINEMENTS:
- Possible bug - there is more than one BROWN running for mtHouse, unfortunately (FIXED: turns out one is a senator!)
- Add 50% threshold line to bar charts
- Make map legend fully responsive instead of 'hide when small'
- Develop cartograms / get them working
 + Refine SD cartogram
 + Make HD cartogram (fit into SD one)
 + Make county cartogram
- Make local focus map object (for focus on Bozeman, Billings, etc.) - ColorMapLocal.js
- Make 'control of house / senate' bar diagram - ChamberControl.js
- Refactor data-wrangling workflow to something maintainable (should have done this up-front)
- Think about how I should have written unit tests.
- Look at optimization (bundling, etc.)
- Look at building this out for use as a template on further projects (e.g. add to build environment)

- Bar chart
    + Play with limits on horizontal scale (60% of vote, 80%?)
    + Add 50% line

- County map
    + Add city labels and major highways? (NOT NOW)

- County table
    + Organize by region (urban counties, others...
Conversation w Becker, Nov 1:
- He'll make dashboard template - with tabs for each race
- I need to make self-contained javascript functions rendering each graphic using data.
- Make a function that generates each tab, pulls in each graph.
- Include an on-tab refresh button that checks for new data, re-renders graphs if there's new data


## References

http://ejb.github.io/2016/05/23/a-better-way-to-structure-d3-code.html
