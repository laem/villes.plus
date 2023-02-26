const OverpassInstance = 'https://overpass-api.de/api/interpreter'

export const request = (name, requestCore) => `

[out:json][timeout:25];
( ${
	/^\d+$/.test(name) ? `area(${3600000000 + +name})` : `area[name="${name}"]`
}; )->.searchArea;
(
${requestCore}
);
// print results
out body;
>;
out skel qt;
`

export const requestCores = {
	stops: `
  //node["amenity"="pharmacy"](area.searchArea);
//  node["shop"="bakery"](area.searchArea);
//node["public_transport"="stop_position"](area.searchArea);
// Beware, a lot of stop positions (where the bus precisely stops, are not available, whereas bus stops are, on the test region of Bretagne, e.g. Lorient and Saint-Brieuc
  node["highway"="bus_stop"](area.searchArea);
`,
	townhalls: `
  node["amenity"="townhall"](area.searchArea);
  way["amenity"="townhall"](area.searchArea);
  relation["amenity"="townhall"](area.searchArea);
		`,
}
export const overpassRequestURL = (city, requestCoreName) =>
	encodeURI(
		`${OverpassInstance}?data=${request(
			decodeURIComponent(city),
			requestCores[requestCoreName]
		)}`
	)
