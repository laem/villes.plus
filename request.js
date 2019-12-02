export default `
/*

This query looks for nodes, ways and relations 

with the given key/value combination.

Choose your region and hit the Run button above!

*/

[out:json]/*fixed by auto repair*/[timeout:25];
// fetch area “Paris” to search in
area(3600452920)->.searchArea;
// gather results


(

  way["place"="square"](area.searchArea);

  way["leisure"="park"](area.searchArea);

  way["highway"="footway"](area.searchArea);

  way["highway"="pedestrian"]["foot"!="private"](area.searchArea);

  way["landuse"="grass"](area.searchArea);

  way["landuse"="recreation_ground"](area.searchArea);

);

// print results

out meta;/*fixed by auto repair*/

>;

out meta qt;/*fixed by auto repair*/




`;
