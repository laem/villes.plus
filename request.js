export default placeName => `

[out:json][timeout:60];
( area[name="${placeName}"][admin_level="8"]; )->.searchArea;


(
  way["leisure"="park"](area.searchArea);
  relation["leisure"="park"](area.searchArea);
  way["leisure"="garden"](area.searchArea);
  relation["leisure"="garden"](area.searchArea);

  way["highway"="footway"]["footway"!~"sidewalk|crossing"](area.searchArea);

  way["highway"="pedestrian"]["foot"!="private"](area.searchArea);
  relation["highway"="pedestrian"]["foot"!="private"](area.searchArea);

  way["landuse"="grass"](area.searchArea);
  relation["landuse"="grass"](area.searchArea);

  way["landuse"="recreation_ground"](area.searchArea);
  relation["landuse"="recreation_ground"](area.searchArea);

);


out geom;




`
