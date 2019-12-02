export default placeName => `

[out:json][timeout:25];
( area[name="${placeName}"][admin_level="8"]; )->.searchArea;


(

  way["place"="square"](area.searchArea);

  way["leisure"="park"](area.searchArea);

  way["highway"="footway"]["footway"!~"sidewalk|crossing"](area.searchArea);

  way["highway"="pedestrian"]["foot"!="private"](area.searchArea);

  way["landuse"="grass"](area.searchArea);

  way["landuse"="recreation_ground"](area.searchArea);

);


out meta;

>;

out meta qt;





`
