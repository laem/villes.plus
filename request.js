export default placeName => `

[out:json][timeout:60];
/* Level 8 corresponds quite well to french cities as we known them */
( area[name="${placeName}"][admin_level="8"]; )->.searchArea;


(
/* Removed since they include lots of non-pedestrian areas
 *
  way["leisure"="park"](area.searchArea);
  relation["leisure"="park"](area.searchArea);
  way["leisure"="garden"](area.searchArea);
  relation["leisure"="garden"](area.searchArea);
  */

  /* Forests and woods (what's the differnce ?) are excluded
  way["landuse"="forest"](area.searchArea);
  relation["landuse"="forest"](area.searchArea);
  way["natural"="wood"](area.searchArea);
*/


  way["highway"~"pedestrian|footway|path"]["footway"!~"sidewalk|crossing"]["foot"!~"private|no"]["access"!~"private|no"](area.searchArea);
  relation["highway"~"pedestrian|footway|path"]["footway"!~"sidewalk|crossing"]["foot"!~"private|no"]["access"!~"private|no"](area.searchArea);

  /* relation highway=path do not exist in Paris, Strasbourg. Included in case it exists elsewhere. The others do exist*/
  way["highway"="track"]["motor_vehicle"="no"](area.searchArea);
  way["highway"="steps"](area.searchArea);


  /* 
    These are excluded, since they do not mean it is a public pedestrian place, and even if you can go sit on the grass, it's not designed to be walked on.
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
