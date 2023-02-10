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
export const overpassRequestURL = (city, requestCore) =>
	encodeURI(
		`${OverpassInstance}?data=${request(decodeURIComponent(city), requestCore)}`
	)
