import régions from '../../../régions.yaml'

export async function GET() {
	const req = await Promise.all(
		régions.map(({ osmId }) =>
			fetch(
				`http://polygons.openstreetmap.fr/get_geojson.py?id=${osmId}&params=0.020000-0.005000-0.005000`
			).then((r) => r.json())
		)
	)
	console.log('req', req)

	const data = {
		type: 'FeatureCollection',
		features: req.map((geometry) => ({
			type: 'Feature',
			properties: {
				stroke: '#555555',
				'stroke-width': 2,
				'stroke-opacity': 1,
				fill: '#e01b24',
				'fill-opacity': 0.5,
			},
			geometry: geometry,
		})),
	}

	return Response.json(data)
}
