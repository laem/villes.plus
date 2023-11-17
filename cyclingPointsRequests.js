export const OverpassInstance = 'https://overpass-api.de/api/interpreter'
//const OverpassInstance = 'https://overpass.kumi.systems/api/interpreter'

const testHasLevel = (name) => /.+\.\d$/.test(name)
const splitName = (name) => name.split('.')

export const processName = (name) =>
	testHasLevel(name) ? splitName(name)[0] : name

export const request = (name, requestCore) => {
	const isId = /^\d+$/.test(name)
	const hasLevel = testHasLevel(name)

	const processedName = processName(name),
		level = hasLevel && splitName(name)[1],
		levelModifier = hasLevel ? `[admin_level="${level}"]` : ''

	return `

[out:json][timeout:25];
( ${
		isId
			? `area(${3600000000 + +name})`
			: `area[name="${processedName}"]${levelModifier}`
	}; )->.searchArea;
(
${requestCore}
);
// print results
out body;
>;
out skel qt;
`
}

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
export const overpassRequestURL = (city, requestCoreName) => {
	const requestContent = request(
		decodeURIComponent(city),
		requestCores[requestCoreName]
	)
	console.log(requestContent)
	return encodeURI(`${OverpassInstance}?data=${requestContent}`)
}
