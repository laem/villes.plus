import { getData as getRégionsData } from '@/app/cyclables/regions/page'
import { getData as getDépartementsData } from '@/app/cyclables/departements/page'
import { getBackgroundColor } from '@/CyclableScoreVignette'
import régions from '../../../régions.yaml'
import départements from '../../../départements.ts'

// TODO this route is not cached, and hence can result new requests even if the data doesn't change for a month
export async function GET(request) {
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

	console.log('will request villes plus scores')
	const fetchFunction =
		maille === 'départements' ? getDépartementsData : getRégionsData
	const scores = await fetchFunction()

	const geojson = {
		type: 'FeatureCollection',
		features: req.map(([{ osmId, nom }, geometry]) => {
			if (scores[nom] == null) console.log('score nul pour ' + nom)
			return {
				type: 'Feature',
				properties: {
					osmId,
					nom,
					score: scores[nom],
					style: `fill: ${getBackgroundColor(
						scores[nom]?.score || 0
					)}; stroke: #ffffff; stroke-width: .6px`,
				},
				geometry: geometry,
			}
		}),
	}

	return Response.json({ scores, geojson })
}
