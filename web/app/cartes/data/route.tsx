import régions from '../../../régions.yaml'

export async function GET() {
	console.log('will request polygons')
	const req = await Promise.all(
		régions.map(({ osmId, nom }) =>
			fetch(
				`http://polygons.openstreetmap.fr/get_geojson.py?id=${osmId}&params=0.020000-0.005000-0.005000`
			)
				.then((r) => r.json())
				.then((json) => [{ osmId, nom }, json])
		)
	)

	const data = {
		type: 'FeatureCollection',
		features: req.map(([{ osmId, nom }, geometry]) => ({
			type: 'Feature',
			properties: {
				osmId,
				nom,
				style: `fill: ${
					Math.random() > 0.5 ? 'blue' : 'orange'
				}; stroke: white; stroke-width: 1px`,
			},
			geometry: geometry,
		})),
	}

	return Response.json(data)
}
