export const createTurfPointCollection = (points) => ({
	type: 'FeatureCollection',
	features: points.map((p) => ({
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Point',
			coordinates: [p.lon, p.lat],
		},
	})),
})
