// data-wrangling.js
// Collection of functions for prepping / wrangling data

/* LOGIC

Two vote data sources, counties, and races.

Races is used for race-summary bar charts, as well as for district-based maps and tables for state house/senate district races.

Counties is used for county-based maps and tables in statewide races and ballot initiatives.



*/

// Supplemental info (e.g. party, incumbency)
// TODO: Look at breaking this out into a separate file
var extraCandidateInfo = {
  'mtGov': {
    'BULLOCK': {'party': 'D', 'incumbent': 'yes'},
    'GIANFORTE': {'party': 'R', 'incumbent': 'no'},
    'DUNLAP': {'party': 'L', 'incumbent': 'no'},
  },
  'usRep' : {
    'ZINKE' : {'party': 'R', 'incumbent': 'yes'},
    'JUNEAU': {'party': 'D', 'incumbent': 'no'},
    'BRECKENRIDGE' : {'party': 'L', 'incumbent': 'no'},
  },
  'usPresident': {
    'CLINTON': {'party': 'D', 'incumbent': 'no'},
    'TRUMP': {'party': 'R', 'incumbent': 'no'},
    'JOHNSON': {'party': 'L', 'incumbent': 'no'},
    'STEIN': {'party': 'G', 'incumbent': 'no'},
    'DE LA FUENTE': {'party': 'A', 'incumbent': 'no'},
  },
  'antiTrapping': {
    'YES ON INITIATIVE I-177': {'party': 'Y', 'altName': 'YES'},
    'NO ON INITIATIVE I-177': {'party': 'N', 'altName': 'NO'},
  },
  'medMarijuana': {
    'YES ON INITIATIVE I-182': {'party': 'Y', 'altName': 'YES'},
    'NO ON INITIATIVE I-182': {'party': 'N', 'altName': 'NO'},
  },
};

var mtLegExtraCandidateInfo = {
  "mtHouse": {
    "GUNDERSON": {
      "name": "Steve Gunderson",
      "party": "R",
      "district": "HD 1",
      "incumbent": "no"
    },
    "HAARSTICK": {
      "name": "Steve Haarstick",
      "party": "D",
      "district": "HD 1",
      "incumbent": "no"
    },
    "CUFFE": {
      "name": "Mike Cuffe",
      "party": "R",
      "district": "HD 2",
      "incumbent": "yes"
    },
    "MCGARRY": {
      "name": "David B. McGarry",
      "party": "D",
      "district": "HD 2",
      "incumbent": "no"
    },
    "PERRY": {
      "name": "Zac Perry",
      "party": "D",
      "district": "HD 3",
      "incumbent": "yes"
    },
    "ROSE": {
      "name": "Taylor Rose",
      "party": "R",
      "district": "HD 3",
      "incumbent": "no"
    },
    "GENTRY": {
      "name": "Deborah Gentry",
      "party": "D",
      "district": "HD 4",
      "incumbent": "no"
    },
    "REGIER": {
      "name": "Matt Regier",
      "party": "R",
      "district": "HD 4",
      "incumbent": "no"
    },
    "BILLI": {
      "name": "Chet Billi",
      "party": "R",
      "district": "HD 5",
      "incumbent": "no"
    },
    "FERN": {
      "name": "Dave Fern",
      "party": "D",
      "district": "HD 5",
      "incumbent": "no"
    },
    "GLIMM": {
      "name": "Carl Glimm",
      "party": "R",
      "district": "HD 6",
      "incumbent": "yes"
    },
    "MORROW": {
      "name": "Lisa Morrow",
      "party": "D",
      "district": "HD 6",
      "incumbent": "no"
    },
    "GARNER": {
      "name": "Frank Garner",
      "party": "R",
      "district": "HD 7",
      "incumbent": "yes"
    },
    "STANLEY": {
      "name": "Lynn Stanley",
      "party": "D",
      "district": "HD 7",
      "incumbent": "no"
    },
    "LAVIN": {
      "name": "Steve Lavin",
      "party": "R",
      "district": "HD 8",
      "incumbent": "yes"
    },
    "RAPPLEYE": {
      "name": "C Paige Rappleye",
      "party": "D",
      "district": "HD 8",
      "incumbent": "no"
    },
    "BRODEHL": {
      "name": "Randy Brodehl",
      "party": "R",
      "district": "HD 9",
      "incumbent": "yes"
    },
    "MACLEAN": {
      "name": "Brittany MacLean",
      "party": "D",
      "district": "HD 9",
      "incumbent": "no"
    },
    "NOLAND": {
      "name": "Mark Ray Noland",
      "party": "R",
      "district": "HD 10",
      "incumbent": "yes"
    },
    "SWANSON": {
      "name": "Kathy Swanson",
      "party": "D",
      "district": "HD 77",
      "incumbent": "yes"
    },
    "BECH": {
      "name": "Eileen Bach Bech",
      "party": "D",
      "district": "HD 11",
      "incumbent": "no"
    },
    "SKEES": {
      "name": "Derek Skees",
      "party": "R",
      "district": "HD 11",
      "incumbent": "no"
    },
    "EVANS": {
      "name": "Susan Evans",
      "party": "D",
      "district": "HD 12",
      "incumbent": "no"
    },
    "HERTZ": {
      "name": "Adam Hertz",
      "party": "R",
      "district": "HD 96",
      "incumbent": "no"
    },
    "ACHATZ": {
      "name": "Debra J Achatz",
      "party": "D",
      "district": "HD 13",
      "incumbent": "no"
    },
    "BROWN": {
      "name": "Zach Brown",
      "party": "D",
      "district": "HD 63",
      "incumbent": "yes"
    },
    "FOSTER": {
      "name": "Bryan Foster",
      "party": "D",
      "district": "HD 14",
      "incumbent": "no"
    },
    "LOGE": {
      "name": "Denley M. Loge",
      "party": "R",
      "district": "HD 14",
      "incumbent": "no"
    },
    "KIPP III": {
      "name": "George G. Kipp III",
      "party": "D",
      "district": "HD 15",
      "incumbent": "yes"
    },
    "WEBBER": {
      "name": "Susan A. Webber",
      "party": "D",
      "district": "HD 16",
      "incumbent": "yes"
    },
    "FITZGERALD": {
      "name": "Ross H. Fitzgerald",
      "party": "R",
      "district": "HD 17",
      "incumbent": "no"
    },
    "SPORKIN-MORRISON": {
      "name": "Barnett G. Sporkin-Morrison",
      "party": "D",
      "district": "HD 17",
      "incumbent": "no"
    },
    "COOK": {
      "name": "Rob Cook",
      "party": "R",
      "district": "HD 18",
      "incumbent": "yes"
    },
    "MCKAMEY": {
      "name": "Wendy McKamey",
      "party": "R",
      "district": "HD 19",
      "incumbent": "no"
    },
    "OLSEN": {
      "name": "Andrea Olsen",
      "party": "D",
      "district": "HD 100",
      "incumbent": "yes"
    },
    "ANDERSON": {
      "name": "Fred Anderson",
      "party": "R",
      "district": "HD 20",
      "incumbent": "no"
    },
    "RAPP": {
      "name": "Amy J. Rapp",
      "party": "D",
      "district": "HD 20",
      "incumbent": "no"
    },
    "JACOBSON": {
      "name": "Tom Jacobson",
      "party": "D",
      "district": "HD 21",
      "incumbent": "yes"
    },
    "FERDERER": {
      "name": "Albert J Ferderer",
      "party": "D",
      "district": "HD 22",
      "incumbent": "no"
    },
    "SHELDON-GALLOWAY": {
      "name": "Lola Sheldon-Galloway",
      "party": "R",
      "district": "HD 22",
      "incumbent": "no"
    },
    "DUNN": {
      "name": "Mark A. Dunn",
      "party": "R",
      "district": "HD 23",
      "incumbent": "no"
    },
    "HAMLETT": {
      "name": "Brad Hamlett",
      "party": "D",
      "district": "HD 23",
      "incumbent": "no"
    },
    "PRICE": {
      "name": "Jean Price",
      "party": "D",
      "district": "HD 24",
      "incumbent": "yes"
    },
    "RAAEN": {
      "name": "William Raaen",
      "party": "R",
      "district": "HD 24",
      "incumbent": "no"
    },
    "LANKFORD": {
      "name": "Garrett Lankford",
      "party": "D",
      "district": "HD 25",
      "incumbent": "no"
    },
    "TREBAS": {
      "name": "Jeremy Trebas",
      "party": "R",
      "district": "HD 25",
      "incumbent": "no"
    },
    "COOPER": {
      "name": "Michael K. Cooper Sr.",
      "party": "R",
      "district": "HD 26",
      "incumbent": "no"
    },
    "SCHREINER": {
      "name": "Casey J. Schreiner",
      "party": "D",
      "district": "HD 26",
      "incumbent": "no"
    },
    "O'HARA": {
      "name": "James O'Hara",
      "party": "R",
      "district": "HD 27",
      "incumbent": "no"
    },
    "ROMINGER": {
      "name": "Ryan Rominger",
      "party": "D",
      "district": "HD 27",
      "incumbent": "no"
    },
    "BACHMEIER": {
      "name": "Jacob Bachmeier",
      "party": "D",
      "district": "HD 28",
      "incumbent": "no"
    },
    "HESS": {
      "name": "Stephanie Hess",
      "party": "R",
      "district": "HD 28",
      "incumbent": "yes"
    },
    "BARTEL": {
      "name": "Dan Bartel",
      "party": "R",
      "district": "HD 29",
      "incumbent": "no"
    },
    "DURLEY": {
      "name": "Dryn Durley",
      "party": "D",
      "district": "HD 29",
      "incumbent": "no"
    },
    "GALT": {
      "name": "E. Wylie Galt",
      "party": "R",
      "district": "HD 30",
      "incumbent": "no"
    },
    "JOHNSON": {
      "name": "Linda Johnson",
      "party": "D",
      "district": "HD 30",
      "incumbent": "no"
    },
    "SMITH": {
      "name": "Bridget Smith",
      "party": "D",
      "district": "HD 31",
      "incumbent": "yes"
    },
    "WINDY BOY": {
      "name": "Jonathan Windy Boy",
      "party": "D",
      "district": "HD 32",
      "incumbent": "no"
    },
    "FINLEY": {
      "name": "Mike Finley",
      "party": "D",
      "district": "HD 33",
      "incumbent": "no"
    },
    "KNUDSEN": {
      "name": "Austin Knudsen",
      "party": "R",
      "district": "HD 34",
      "incumbent": "yes"
    },
    "CARLISLE": {
      "name": "Evelyn Carlisle",
      "party": "D",
      "district": "HD 34",
      "incumbent": "no"
    },
    "STAFFANSON": {
      "name": "Scott Staffanson",
      "party": "R",
      "district": "HD 35",
      "incumbent": "yes"
    },
    "TRUMPOWER": {
      "name": "Chris Trumpower",
      "party": "D",
      "district": "HD 35",
      "incumbent": "no"
    },
    "DOANE": {
      "name": "Alan Doane",
      "party": "R",
      "district": "HD 36",
      "incumbent": "yes"
    },
    "RUDDY": {
      "name": "Mike Ruddy",
      "party": "D",
      "district": "HD 36",
      "incumbent": "no"
    },
    "CRAMER": {
      "name": "Judi Cramer",
      "party": "D",
      "district": "HD 37",
      "incumbent": "no"
    },
    "HARRIS": {
      "name": "Bill Harris",
      "party": "R",
      "district": "HD 37",
      "incumbent": "no"
    },
    "HOLMLUND": {
      "name": "Kenneth L. Holmlund",
      "party": "R",
      "district": "HD 38",
      "incumbent": "yes"
    },
    "MUGGLI": {
      "name": "Steve Muggli",
      "party": "D",
      "district": "HD 38",
      "incumbent": "no"
    },
    "CUSTER": {
      "name": "Geraldine Custer",
      "party": "R",
      "district": "HD 39",
      "incumbent": "yes"
    },
    "MILLER": {
      "name": "Bruce Miller",
      "party": "D",
      "district": "HD 39",
      "incumbent": "no"
    },
    "USHER": {
      "name": "Barry Usher",
      "party": "R",
      "district": "HD 40",
      "incumbent": "no"
    },
    "PEPPERS": {
      "name": "Rae Peppers",
      "party": "D",
      "district": "HD 41",
      "incumbent": "yes"
    },
    "STEWART PEREGOY": {
      "name": "Sharon Stewart Peregoy",
      "party": "D",
      "district": "HD 42",
      "incumbent": "no"
    },
    "DANIELS": {
      "name": "Josh Daniels",
      "party": "L",
      "district": "HD 43",
      "incumbent": "no"
    },
    "PINCOLINI": {
      "name": "Elizabeth Pincolini",
      "party": "D",
      "district": "HD 43",
      "incumbent": "no"
    },
    "WEBB": {
      "name": "Peggy Webb",
      "party": "R",
      "district": "HD 43",
      "incumbent": "no"
    },
    "BOITER": {
      "name": "Kari Boiter",
      "party": "D",
      "district": "HD 44",
      "incumbent": "no"
    },
    "MORTENSEN": {
      "name": "Dale Mortensen",
      "party": "R",
      "district": "HD 44",
      "incumbent": "yes"
    },
    "CROUCH": {
      "name": "Ken Crouch",
      "party": "D",
      "district": "HD 45",
      "incumbent": "no"
    },
    "ZOLNIKOV": {
      "name": "Daniel Zolnikov",
      "party": "R",
      "district": "HD 45",
      "incumbent": "yes"
    },
    "BUCKLEY": {
      "name": "Angie Buckley",
      "party": "D",
      "district": "HD 46",
      "incumbent": "no"
    },
    "JONES": {
      "name": "Donald W. Jones",
      "party": "R",
      "district": "HD 46",
      "incumbent": "yes"
    },
    "KELKER": {
      "name": "Kathy Kelker",
      "party": "D",
      "district": "HD 47",
      "incumbent": "yes"
    },
    "THOMAS": {
      "name": "Jason Lee Thomas",
      "party": "R",
      "district": "HD 47",
      "incumbent": "no"
    },
    "KARJALA": {
      "name": "Jessica L. Karjala",
      "party": "D",
      "district": "HD 48",
      "incumbent": "yes"
    },
    "SAUNDERS": {
      "name": "Robert Saunders",
      "party": "R",
      "district": "HD 48",
      "incumbent": "no"
    },
    "MCCARTHY": {
      "name": "Kelly McCarthy",
      "party": "D",
      "district": "HD 49",
      "incumbent": "yes"
    },
    "COURT": {
      "name": "Virginia Court",
      "party": "D",
      "district": "HD 50",
      "incumbent": "yes"
    },
    "SEEKINS-CROWE": {
      "name": "Kerri Seekins-Crowe",
      "party": "R",
      "district": "HD 50",
      "incumbent": "no"
    },
    "ROSENDALE": {
      "name": "Adam Rosendale",
      "party": "R",
      "district": "HD 51",
      "incumbent": "no"
    },
    "VEIS": {
      "name": "Shoots Veis",
      "party": "D",
      "district": "HD 51",
      "incumbent": "no"
    },
    "GOODRIDGE": {
      "name": "Chris Goodridge",
      "party": "D",
      "district": "HD 52",
      "incumbent": "no"
    },
    "PATELIS": {
      "name": "Jimmy Patelis",
      "party": "R",
      "district": "HD 52",
      "incumbent": "no"
    },
    "LENZ": {
      "name": "Dennis Lenz",
      "party": "R",
      "district": "HD 53",
      "incumbent": "no"
    },
    "MATNEY": {
      "name": "Jordan Matney",
      "party": "D",
      "district": "HD 53",
      "incumbent": "no"
    },
    "ESSMANN": {
      "name": "Jeff Essmann",
      "party": "R",
      "district": "HD 54",
      "incumbent": "yes"
    },
    "ARNOLD": {
      "name": "Ryan Arnold",
      "party": "D",
      "district": "HD 55",
      "incumbent": "no"
    },
    "RICCI": {
      "name": "Vince Ricci",
      "party": "R",
      "district": "HD 55",
      "incumbent": "yes"
    },
    "TEMPLET": {
      "name": "Daryl L Templet",
      "party": "D",
      "district": "HD 56",
      "incumbent": "no"
    },
    "VINTON": {
      "name": "Sue Vinton",
      "party": "R",
      "district": "HD 56",
      "incumbent": "no"
    },
    "FORCIER": {
      "name": "Andrew T. Forcier",
      "party": "L",
      "district": "HD 57",
      "incumbent": "no"
    },
    "MANDEVILLE": {
      "name": "Forrest J. Mandeville",
      "party": "R",
      "district": "HD 57",
      "incumbent": "yes"
    },
    "BERGLEE": {
      "name": "Seth Berglee",
      "party": "R",
      "district": "HD 58",
      "incumbent": "yes"
    },
    "CRABTREE": {
      "name": "Mike Crabtree",
      "party": "D",
      "district": "HD 58",
      "incumbent": "no"
    },
    "ADAMS": {
      "name": "Dirk Adams",
      "party": "D",
      "district": "HD 59",
      "incumbent": "no"
    },
    "REDFIELD": {
      "name": "Alan Redfield",
      "party": "R",
      "district": "HD 59",
      "incumbent": "yes"
    },
    "BISHOP": {
      "name": "Laurie Bishop",
      "party": "D",
      "district": "HD 60",
      "incumbent": "no"
    },
    "LAMM": {
      "name": "Debra Lamm",
      "party": "R",
      "district": "HD 60",
      "incumbent": "yes"
    },
    "GANSER": {
      "name": "Neal Ganser",
      "party": "R",
      "district": "HD 61",
      "incumbent": "no"
    },
    "HAMILTON": {
      "name": "Jim Hamilton",
      "party": "D",
      "district": "HD 61",
      "incumbent": "no"
    },
    "WENDT": {
      "name": "Francis Wendt",
      "party": "L",
      "district": "HD 61",
      "incumbent": "no"
    },
    "WOODS": {
      "name": "Tom Woods",
      "party": "D",
      "district": "HD 62",
      "incumbent": "yes"
    },
    "KING": {
      "name": "Jim King",
      "party": "R",
      "district": "HD 63",
      "incumbent": "no"
    },
    "ELLISON": {
      "name": "Chase Ellison",
      "party": "D",
      "district": "HD 64",
      "incumbent": "no"
    },
    "WHITE": {
      "name": "Kerry E White",
      "party": "R",
      "district": "HD 64",
      "incumbent": "yes"
    },
    "KNOKEY": {
      "name": "Jon A. Knokey",
      "party": "R",
      "district": "HD 65",
      "incumbent": "no"
    },
    "POPE": {
      "name": "Christopher Pope",
      "party": "D",
      "district": "HD 65",
      "incumbent": "yes"
    },
    "HAYMAN": {
      "name": "Denise Hayman",
      "party": "D",
      "district": "HD 66",
      "incumbent": "yes"
    },
    "BURNETT": {
      "name": "Tom Burnett",
      "party": "R",
      "district": "HD 67",
      "incumbent": "yes"
    },
    "JURMU": {
      "name": "John Jurmu",
      "party": "D",
      "district": "HD 67",
      "incumbent": "no"
    },
    "ANDES": {
      "name": "David K Andes",
      "party": "D",
      "district": "HD 68",
      "incumbent": "no"
    },
    "GRUBBS": {
      "name": "Bruce Grubbs",
      "party": "R",
      "district": "HD 68",
      "incumbent": "no"
    },
    "DUNHAM": {
      "name": "Eric Dunham",
      "party": "D",
      "district": "HD 69",
      "incumbent": "no"
    },
    "SALES": {
      "name": "Walt Sales",
      "party": "R",
      "district": "HD 69",
      "incumbent": "no"
    },
    "FLYNN": {
      "name": "Kelly Flynn",
      "party": "R",
      "district": "HD 70",
      "incumbent": "yes"
    },
    "HUSO": {
      "name": "Merlyn Huso",
      "party": "D",
      "district": "HD 70",
      "incumbent": "no"
    },
    "SHAW": {
      "name": "Ray L. Shaw",
      "party": "R",
      "district": "HD 71",
      "incumbent": "yes"
    },
    "MOSOLF": {
      "name": "Mike Mosolf",
      "party": "D",
      "district": "HD 72",
      "incumbent": "no"
    },
    "WELCH": {
      "name": "Tom Welch",
      "party": "R",
      "district": "HD 72",
      "incumbent": "no"
    },
    "KEANE": {
      "name": "Jim Keane",
      "party": "D",
      "district": "HD 73",
      "incumbent": "no"
    },
    "CURTIS": {
      "name": "Amanda Curtis",
      "party": "D",
      "district": "HD 74",
      "incumbent": "no"
    },
    "STEKETEE": {
      "name": "Sabrina Steketee",
      "party": "D",
      "district": "HD 75",
      "incumbent": "no"
    },
    "WAGONER": {
      "name": "Kirk B. Wagoner",
      "party": "R",
      "district": "HD 75",
      "incumbent": "yes"
    },
    "LYNCH": {
      "name": "Ryan Lynch",
      "party": "D",
      "district": "HD 76",
      "incumbent": "yes"
    },
    "GRAYBEAL": {
      "name": "Kerry Graybeal",
      "party": "R",
      "district": "HD 77",
      "incumbent": "no"
    },
    "DESILVA": {
      "name": "Dean K DeSilva",
      "party": "R",
      "district": "HD 78",
      "incumbent": "no"
    },
    "PIERSON": {
      "name": "Gordon Pierson Jr",
      "party": "D",
      "district": "HD 78",
      "incumbent": "yes"
    },
    "ECK": {
      "name": "Jenny Eck",
      "party": "D",
      "district": "HD 79",
      "incumbent": "yes"
    },
    "BEARD": {
      "name": "Becky Beard",
      "party": "R",
      "district": "HD 80",
      "incumbent": "no"
    },
    "CAIN": {
      "name": "Elizabeth Cain",
      "party": "D",
      "district": "HD 80",
      "incumbent": "no"
    },
    "CLAGUE": {
      "name": "Valerie Clague",
      "party": "I",
      "district": "HD 80",
      "incumbent": "no"
    },
    "ELLIS": {
      "name": "Janet Ellis",
      "party": "D",
      "district": "HD 81",
      "incumbent": "yes"
    },
    "FUNK": {
      "name": "Moffie Funk",
      "party": "D",
      "district": "HD 82",
      "incumbent": "yes"
    },
    "ABBOTT": {
      "name": "Kim Abbott",
      "party": "D",
      "district": "HD 83",
      "incumbent": "no"
    },
    "LEACH": {
      "name": "Bob Leach",
      "party": "R",
      "district": "HD 83",
      "incumbent": "no"
    },
    "BONAR": {
      "name": "Paula Bonar",
      "party": "L",
      "district": "HD 84",
      "incumbent": "no"
    },
    "DUNWELL": {
      "name": "Mary Ann Dunwell",
      "party": "D",
      "district": "HD 84",
      "incumbent": "yes"
    },
    "GIBSON": {
      "name": "Steve Gibson",
      "party": "R",
      "district": "HD 84",
      "incumbent": "no"
    },
    "MANZELLA": {
      "name": "Theresa Manzella",
      "party": "R",
      "district": "HD 85",
      "incumbent": "yes"
    },
    "YOUNG": {
      "name": "A. Jo Young",
      "party": "D",
      "district": "HD 85",
      "incumbent": "no"
    },
    "EHLI": {
      "name": "Ron Ehli",
      "party": "R",
      "district": "HD 86",
      "incumbent": "yes"
    },
    "NEAL": {
      "name": "Nancy A. Neal",
      "party": "D",
      "district": "HD 86",
      "incumbent": "no"
    },
    "BALLANCE": {
      "name": "Nancy Ballance",
      "party": "R",
      "district": "HD 87",
      "incumbent": "yes"
    },
    "GORSKI": {
      "name": "Margaret J. Gorski",
      "party": "D",
      "district": "HD 88",
      "incumbent": "no"
    },
    "GREEF": {
      "name": "Ed Greef",
      "party": "R",
      "district": "HD 88",
      "incumbent": "yes"
    },
    "KRIGSVOLD": {
      "name": "Alex Krigsvold",
      "party": "R",
      "district": "HD 89",
      "incumbent": "no"
    },
    "MCCONNELL": {
      "name": "Nate McConnell",
      "party": "D",
      "district": "HD 89",
      "incumbent": "yes"
    },
    "MURRAY": {
      "name": "Bill Murray",
      "party": "R",
      "district": "HD 90",
      "incumbent": "no"
    },
    "HILL": {
      "name": "Ellie Hill Smith",
      "party": "D",
      "district": "HD 90",
      "incumbent": "yes"
    },
    "BENNETT": {
      "name": "Bryce Bennett",
      "party": "D",
      "district": "HD 91",
      "incumbent": "yes"
    },
    "HOPKINS": {
      "name": "Mike Hopkins",
      "party": "R",
      "district": "HD 92",
      "incumbent": "no"
    },
    "MARX": {
      "name": "Addrien Marx",
      "party": "D",
      "district": "HD 92",
      "incumbent": "no"
    },
    "CLARK": {
      "name": "Johanna Clark",
      "party": "R",
      "district": "HD 93",
      "incumbent": "no"
    },
    "FLEMING": {
      "name": "John Fleming",
      "party": "D",
      "district": "HD 93",
      "incumbent": "no"
    },
    "COX": {
      "name": "Lance Cox",
      "party": "R",
      "district": "HD 94",
      "incumbent": "no"
    },
    "DUDIK": {
      "name": "Kimberly P. Dudik",
      "party": "D",
      "district": "HD 94",
      "incumbent": "yes"
    },
    "KENCK": {
      "name": "Cyndi Kenck",
      "party": "R",
      "district": "HD 95",
      "incumbent": "no"
    },
    "MORIGEAU": {
      "name": "Shane A. Morigeau",
      "party": "D",
      "district": "HD 95",
      "incumbent": "no"
    },
    "PERSON": {
      "name": "Andrew Person",
      "party": "D",
      "district": "HD 96",
      "incumbent": "yes"
    },
    "TSCHIDA": {
      "name": "Brad Tschida",
      "party": "R",
      "district": "HD 97",
      "incumbent": "yes"
    },
    "CURDY": {
      "name": "Willis Curdy",
      "party": "D",
      "district": "HD 98",
      "incumbent": "yes"
    },
    "ELLSWORTH": {
      "name": "Michael Ellsworth",
      "party": "R",
      "district": "HD 98",
      "incumbent": "no"
    },
    "CUNDIFF": {
      "name": "Susan Cundiff",
      "party": "R",
      "district": "HD 99",
      "incumbent": "no"
    },
    "RYAN": {
      "name": "Marilyn Ryan",
      "party": "D",
      "district": "HD 99",
      "incumbent": "no"
    },
    "MOORE": {
      "name": "David \"Doc\" Moore",
      "party": "R",
      "district": "HD 100",
      "incumbent": "no"
    }
  },
  "mtSen": {
    "BROWN": {
      "name": "Dee L. Brown",
      "party": "R",
      "district": "SD 2",
      "incumbent": "yes",
      "type": "SD"
    },
    "HARTMAN": {
      "name": "Melissa L Hartman",
      "party": "D",
      "district": "SD 3",
      "incumbent": "no",
      "type": "SD"
    },
    "REGIER": {
      "name": "Keith Regier",
      "party": "R",
      "district": "SD 3",
      "incumbent": "no",
      "type": "SD"
    },
    "HARMSEN": {
      "name": "Rolf Harmsen",
      "party": "D",
      "district": "SD 6",
      "incumbent": "no",
      "type": "SD"
    },
    "OLSZEWSKI": {
      "name": "Albert D Olszewski",
      "party": "R",
      "district": "SD 6",
      "incumbent": "no",
      "type": "SD"
    },
    "FIELDER": {
      "name": "Jennifer Fielder",
      "party": "R",
      "district": "SD 7",
      "incumbent": "yes",
      "type": "SD"
    },
    "SHEETS": {
      "name": "Mark Sheets",
      "party": "D",
      "district": "SD 7",
      "incumbent": "no",
      "type": "SD"
    },
    "FITZPATRICK": {
      "name": "Steve Fitzpatrick",
      "party": "R",
      "district": "SD 10",
      "incumbent": "no",
      "type": "SD"
    },
    "MAGIN": {
      "name": "Deborah L. Magin",
      "party": "D",
      "district": "SD 10",
      "incumbent": "no",
      "type": "SD"
    },
    "MCCONNAHA": {
      "name": "Sean McConnaha",
      "party": "D",
      "district": "SD 15",
      "incumbent": "no",
      "type": "SD"
    },
    "OSMUNDSON": {
      "name": "Ryan Osmundson",
      "party": "R",
      "district": "SD 15",
      "incumbent": "no",
      "type": "SD"
    },
    "MEYERS": {
      "name": "G. Bruce Meyers",
      "party": "R",
      "district": "SD 16",
      "incumbent": "no",
      "type": "SD"
    },
    "SMITH": {
      "name": "Frank J. Smith",
      "party": "D",
      "district": "SD 16",
      "incumbent": "no",
      "type": "SD"
    },
    "ADOLPHSON": {
      "name": "Douglas Adolphson",
      "party": "D",
      "district": "SD 17",
      "incumbent": "no",
      "type": "SD"
    },
    "LANG": {
      "name": "Mike L Lang",
      "party": "R",
      "district": "SD 17",
      "incumbent": "no",
      "type": "SD"
    },
    "HINEBAUCH": {
      "name": "Steve Hinebauch",
      "party": "R",
      "district": "SD 18",
      "incumbent": "no",
      "type": "SD"
    },
    "PEASE-LOPEZ": {
      "name": "Carolyn Pease-Lopez",
      "party": "D",
      "district": "SD 21",
      "incumbent": "no",
      "type": "SD"
    },
    "SMALL": {
      "name": "Jason D. Small",
      "party": "R",
      "district": "SD 21",
      "incumbent": "no",
      "type": "SD"
    },
    "VAN TRICHT": {
      "name": "Paul J. Van Tricht",
      "party": "D",
      "district": "SD 23",
      "incumbent": "no",
      "type": "SD"
    },
    "WEBB": {
      "name": "Roger Webb",
      "party": "R",
      "district": "SD 23",
      "incumbent": "yes",
      "type": "SD"
    },
    "HUSTON": {
      "name": "Donna Huston",
      "party": "R",
      "district": "SD 25",
      "incumbent": "no",
      "type": "SD"
    },
    "MACDONALD": {
      "name": "Margie MacDonald",
      "party": "D",
      "district": "SD 26",
      "incumbent": "no",
      "type": "SD"
    },
    "ROBERTS": {
      "name": "Donald Roberts",
      "party": "R",
      "district": "SD 26",
      "incumbent": "no",
      "type": "SD"
    },
    "ABBEY": {
      "name": "Deborah Abbey",
      "party": "D",
      "district": "SD 28",
      "incumbent": "no",
      "type": "SD"
    },
    "RICHMOND": {
      "name": "Tom Richmond",
      "party": "R",
      "district": "SD 28",
      "incumbent": "no",
      "type": "SD"
    },
    "PHILLIPS": {
      "name": "Mike Phillips",
      "party": "D",
      "district": "SD 31",
      "incumbent": "yes",
      "type": "SD"
    },
    "SALES": {
      "name": "Scott Sales",
      "party": "R",
      "district": "SD 35",
      "incumbent": "yes",
      "type": "SD"
    },
    "WELBORN": {
      "name": "Jeff Welborn",
      "party": "R",
      "district": "SD 36",
      "incumbent": "no",
      "type": "SD"
    },
    "SESSO": {
      "name": "Jon C. Sesso",
      "party": "D",
      "district": "SD 37",
      "incumbent": "yes",
      "type": "SD"
    },
    "MCCLAFFERTY": {
      "name": "Edith (Edie) McClafferty",
      "party": "D",
      "district": "SD 38",
      "incumbent": "no",
      "type": "SD"
    },
    "ROSENBAUM": {
      "name": "Glenn J. Rosenbaum",
      "party": "R",
      "district": "SD 38",
      "incumbent": "no",
      "type": "SD"
    },
    "MOTTA": {
      "name": "Dick Motta",
      "party": "L",
      "district": "SD 39",
      "incumbent": "no",
      "type": "SD"
    },
    "NORDWICK": {
      "name": "Suzzann Nordwick",
      "party": "R",
      "district": "SD 39",
      "incumbent": "no",
      "type": "SD"
    },
    "VUCKOVICH": {
      "name": "Gene Vuckovich",
      "party": "D",
      "district": "SD 39",
      "incumbent": "yes",
      "type": "SD"
    },
    "GAUTHIER": {
      "name": "Terry J. Gauthier",
      "party": "R",
      "district": "SD 40",
      "incumbent": "no",
      "type": "SD"
    },
    "JACOBSON": {
      "name": "Hal Jacobson",
      "party": "D",
      "district": "SD 40",
      "incumbent": "no",
      "type": "SD"
    },
    "OLSEN": {
      "name": "James R. Olsen",
      "party": "D",
      "district": "SD 44",
      "incumbent": "no",
      "type": "SD"
    },
    "THOMAS": {
      "name": "Fred Thomas",
      "party": "R",
      "district": "SD 44",
      "incumbent": "yes",
      "type": "SD"
    },
    "BARRETT": {
      "name": "Dick Barrett",
      "party": "D",
      "district": "SD 45",
      "incumbent": "yes",
      "type": "SD"
    },
    "HUME": {
      "name": "Sashin Hume",
      "party": "R",
      "district": "SD 45",
      "incumbent": "no",
      "type": "SD"
    },
    "MALEK": {
      "name": "Sue Malek",
      "party": "D",
      "district": "SD 46",
      "incumbent": "yes",
      "type": "SD"
    },
    "PUMMILL": {
      "name": "Adam S. Pummill",
      "party": "R",
      "district": "SD 46",
      "incumbent": "no",
      "type": "SD"
    },
    "FRANCE": {
      "name": "Tom France",
      "party": "D",
      "district": "SD 47",
      "incumbent": "no",
      "type": "SD"
    },
    "SALOMON": {
      "name": "Daniel R. Salomon",
      "party": "R",
      "district": "SD 47",
      "incumbent": "no",
      "type": "SD"
    }
  }
}

var partyOrder = ['R','D','L','G','A','I','Y','N',null]; // Y and N for initiatives

var RACE_IDS = {
  'mtGov': '001450005632',
  'antiTrapping': '002450001213',
  'medMarijuana': '002450001215',
  'usPresident': '001450005633',
  'usRep': '001450005517',
  'mtSenate': null, // 001450005643 to 5666
  'mtHouse': null, // 001450005518 to 001450005617
};

function getLastUpdate(){
  // TODO: Write this
  // Will return time of last data refresh
}

function parseCandidates(candidates, extraInfo){
  // Parsing for candidates arrays, used by several different functions
  // Takes raw list candidates from either race or county source files,
  // pulls in extra data where available and does a bit of other massaging

  var output = candidates.map(function(d){
    var cand = {};
    cand.name = d.candidate_last;
    cand.fullName = d.candidate_first + " " + d.candidate_last;
    cand.party = null;
    cand.incumbent = 'no'
    cand.votes = +d.votes;

    var key = d.candidate_last;
    // var extraInfo = extraCandidateInfo[raceName]
    if (key in extraInfo) {
      cand.party = extraInfo[key].party;
      cand.incumbent = extraInfo[key].incumbent;
      // overwrite name for ballot initiatives
      if (extraInfo[key].altName) { cand.name = extraInfo[key].altName; }
    }
    return cand;
  });

  // sort by party
  output.sort(function(a,b){
    return partyOrder.indexOf(a.party) < partyOrder.indexOf(b.party) ? -1 : 1;
  });

  return output;
}

function mergeResultsByCounty(countyGeo, countyResults, raceNames){
  // add results object to countyGeo properties for each raceName in raceNames
  // console.log('mergeResultsIn', countyGeo, countyResults, raceNames)

  raceNames.forEach(function(raceName){
    countyGeo.features.forEach(function(county){
      var countyName = county.properties.NAME;
      county.properties[raceName] = getRaceResults(countyResults, countyName, raceName);
    });
  });

  // console.log('mergeResultsOut', countyGeo);
  return countyGeo;
}
function getRaceResults(countyResults, countyName, raceName){
  // gets results for specific county and race
  var raceId = RACE_IDS[raceName];
  // console.log('getRaceIn', countyResults, countyName)

  var results = {}

  countyResults.records.forEach(function(countyResult){
    // Match to countyName
    if (countyResult.name.toUpperCase() === countyName){
      results.county = countyResult.name;
      countyResult.races.forEach(function(race){
        if (race.race_id === raceId){
          results.candidates = parseCandidates(race.candidates, extraCandidateInfo[raceName]);
          results.precincts = +race.total_precincts;
          results.precinctsReporting = +race.num_reporting;
        }
      });
    }
  });
  // console.log('getRaceOut', countyName, raceName, results);
  return results;
}

function summarizePrecincts(precincts){
  // takes precincts array from race-formatted results,
  // returns [precinctsReporting, totalPrecincts]
  var precinctsReporting = 0, totalPrecincts = 0;
  precincts.forEach(function(precinct){
    totalPrecincts += +precinct.total_precincts;
    precinctsReporting += +precinct.num_reporting;
  });
  return [precinctsReporting, totalPrecincts];
}

function summarizeRace(_, raceResults, raceName){
  // Takes results by race, returns object for BarGraph.js
  // _ is a placeholder for geodata
  var raceId = RACE_IDS[raceName];

  var results = {};

  var precincts, candidates;
  raceResults.races.forEach(function(race){
    if (race.race_id === raceId){
      precincts = race.precincts;
      candidates = race.candidates;
    }
  });
  // Replaced with function on following line - left here in case it breaks something unexpectedly
  // var precinctsReporting = 0, totalPrecincts = 0;
  // precincts.forEach(function(precinct){
  //   totalPrecincts += +precinct.total_precincts;
  //   precinctsReporting += +precinct.num_reporting;
  // })
  var pSumr = summarizePrecincts(precincts);
  results.precinctsReporting = pSumr[0];
  results.totalPrecincts = pSumr[1];

  results.results = parseCandidates(candidates, extraCandidateInfo[raceName]);

  var totalVotes = 0;
  results.results.forEach(function(result){
    totalVotes += +result.votes;
  })

  results.totalVotes = totalVotes;

  return results;
}

function mergeLegData(geoData, flatData){
  // Binds .csv-sourced leg data for given house to districts geoJson
  // console.log('geo', geoData)
  // console.log('flat', flatData)


  geoData.features.forEach(function(district){
    var properties = district.properties;
    var matchDistrict;
    // find matching district in flatData
    flatData.forEach(function(row){
      if (+row.number === +properties.number) { matchDistrict = row; }
    });
    if (!properties) {
      console.log('Hey, no matching properties for', district);
    } else {
      properties.name = matchDistrict.district;
      properties.raceId = matchDistrict.id;
      properties.in_cycle = matchDistrict.in_cycle;
      properties.incum_party = matchDistrict.incum_party;
      properties.incum_name =matchDistrict.incum_last;
      if(matchDistrict.region) {properties.region = matchDistrict.region; } // for SDs only, right now
      if(matchDistrict.sen_dist_match) {properties.sen_dist_match = matchDistrict.sen_dist_match; } // for HDs only
    }
  });
  // console.log('merged', geoData);
  return geoData;
}

function summarizeLegRaces(mergedGeoData, raceResults, chamber){
  // takes merged district geoData for given legislative chamber, adds a results (candidates) array to each district
  // console.log('geo merged', mergedGeoData)
  // console.log('results', raceResults)
  // console.log('chamber', chamber)

  mergedGeoData.features.forEach(function(district){
    var properties = district.properties;
    if(properties.in_cycle == 'yes'){
      var raceId = properties.raceId
      var curRace = null;
      raceResults.races.forEach(function(race){
        if (race.race_id === raceId){ curRace = race; }
      });

      if (curRace === null){
        // handles missing data
        console.log('no race result data found for', district.properties.name);
        properties.precinctsReporting = null;
        properties.totalPrecincts = null;
        properties.candidates = [];
      } else {
        pSumr = summarizePrecincts(curRace.precincts);
        properties.precinctsReporting = pSumr[0];
        properties.totalPrecincts = pSumr[1];
        properties.candidates = parseCandidates(curRace.candidates, mtLegExtraCandidateInfo[chamber])
      }
    } else {
      properties.candidates = 'district not in cycle';
    }
  });

  // console.log('racesSummarized', mergedGeoData);
  return mergedGeoData;
}

// OLD, may want to resurrect these functions

// function addRaceToCountyGeoJson(geoJson, countiesForRace, raceName){
//   var geoKey = "NAME",
//     dataKey = "name"

//   var combined = geoJson;
//   combined.features.forEach(function(feature){
//     countiesForRace.counties.forEach(function(county){
//       if (String(county[dataKey]) === String(feature.properties[geoKey])){
//         feature.properties[raceName] = county.candidates;
//         feature.properties.precincts = county.precincts;
//         feature.properties.precinctsReporting = county.precinctsReporting;
//       }
//     });
//   });
//   console.log(combined);
//   return combined;
// }

// function bindFlatToGeoJson(geoJson, data, geoKey, dataKey, includeCols){
//   // Similar to mergeData -- binds "flat" json data (e.g. from a .csv import) to a geoJson object
//   // include cols is an array of fields from the merging data to include

//   var combined = geoJson;
//   combined.features.forEach(function(feature){
//     data.forEach(function(row){
//       if (String(row[dataKey]) === String(feature.properties[geoKey])){
//         includeCols.forEach(function(col){
//           feature.properties[col] = row[col];
//         });
//       }
//     });
//   });
//   return combined;
// }