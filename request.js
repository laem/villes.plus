export default placeName => `

[out:json][timeout:60];
/* Level 8 corresponds quite well to french cities as we known them */
( area[name="${placeName}"][admin_level="8"]; )->.searchArea;


(
  way["leisure"="park"](area.searchArea);
  relation["leisure"="park"](area.searchArea);
  way["leisure"="garden"](area.searchArea);
  relation["leisure"="garden"](area.searchArea);

  way["highway"="footway"]["footway"!~"sidewalk|crossing"]["access"!="private"](area.searchArea);
  way["highway"="path"]["access"!="private"](area.searchArea);

  way["highway"="pedestrian"]["foot"!="private"]["access"!="private"](area.searchArea);
  relation["highway"="pedestrian"]["foot"!="private"]["access"!="private"](area.searchArea);

  /* 
    These are excluded, since they do not mean it is a public pedestrian place
    E.g. the Nice Airport has lots of landuse=grass
    Also, private residential gardens
    True positives are usually enclosed in a another area covered by the request, e.g. leisure=park
  way["landuse"="grass"](area.searchArea);
  relation["landuse"="grass"](area.searchArea);
  */

  way["landuse"="recreation_ground"](area.searchArea);
  relation["landuse"="recreation_ground"](area.searchArea);

  /* We've excluded the "squares", since lots of them have cars or parkings. 
  E.g. name=Place Max Barel in Nice
  Pedestrian squares should have the highway=pedestrian tag
  */

);


out geom;




`
