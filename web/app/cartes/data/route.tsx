import { getData as getRégionsData } from '@/app/cyclables/regions/page'
import { getData as getDépartementsData } from '@/app/cyclables/departements/page'
import { getBackgroundColor } from '@/CyclableScoreVignette'
import régions from '../../../régions.yaml'
import départements from '../../../départements.ts'

export async function GET(request) {
	console.log('CARTE DATA ROUTE CALLED')
	const searchParams = request.nextUrl.searchParams
	const maille = searchParams.get('maille')
	const items =
		maille === 'départements'
			? // Pas d'outre mer pour l'instant, la carte ne le supporte pas
			  départements.filter((el) => el.code < 100)
			: régions
	console.log('will request polygons')
	const req = await Promise.all(
		items.map(({ osmId, nom }) =>
			fetch(
				`http://polygons.openstreetmap.fr/get_geojson.py?id=${osmId}&params=0.020000-0.005000-0.005000`
			)
				.then((r) => r.json())
				.then((json) => [{ osmId, nom }, json])
		)
	)

	const fetchFunction =
		maille === 'départements' ? getDépartementsData : getRégionsData
	const scores = await fetchFunction()

	const geojson = {
		type: 'FeatureCollection',
		features: req.map(([{ osmId, nom }, geometry]) => ({
			type: 'Feature',
			properties: {
				osmId,
				nom,
				style: `fill: ${getBackgroundColor(
					scores[nom]?.score || 0
				)}; stroke: #ffffff; stroke-width: .6px`,
			},
			geometry: geometry,
		})),
	}

	return Response.json({ scores, geojson })
}
