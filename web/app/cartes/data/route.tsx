import { getData } from '@/app/cyclables/regions/page'
import { getBackgroundColor } from '@/CyclableScoreVignette'
import régions from '../../../régions.yaml'
import départements from '../../../départements.ts'

export async function GET() {
	return Response.json(départements)
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

	const scores = await getData()
	console.log(Object.keys(scores))
	const geojson = {
		type: 'FeatureCollection',
		features: req.map(([{ osmId, nom }, geometry]) => ({
			type: 'Feature',
			properties: {
				osmId,
				nom,
				style: `fill: ${getBackgroundColor(
					scores[nom]?.score || 0
				)}; stroke: #ffffff99; stroke-width: .6px`,
			},
			geometry: geometry,
		})),
	}

	return Response.json({ scores, geojson })
}
