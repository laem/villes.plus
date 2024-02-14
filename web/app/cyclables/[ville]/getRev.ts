import { OverpassInstance, request } from '@/../cyclingPointsRequests'
import { fetchRetry } from '@/../utils'
import osmtogeojson from 'osmtogeojson'
import lyonColors from '@/rev/Métropole de Lyon/couleurs.yaml'
import rennes from '@/rev/Rennes Métropole/lignes.json'

export default async (name) => {
	console.log('rev bloug', name)
	if (name === 'Bordeaux Métropole') {
		const url =
			'https://raw.githubusercontent.com/velo-cite/observatoire/main/public/reve_bxmetro.geojson'
		const request = await fetch(url)
		const json = await request.json()

		console.log('rev bloug', json)

		const withStyle = {
			...json,
			features: json.features.map((feature) => ({
				...feature,
				properties: {
					stroke: feature.properties['_umap_options']?.color || '#aaaaaa',
					'stroke-width': 5,
					'stroke-opacity': 1,
				},
			})),
		}
		return withStyle
	}
	if (name === 'Métropole de Lyon') {
		const url = (num) =>
			`https://raw.githubusercontent.com/benoitdemaegdt/voieslyonnaises/main/content/voies-lyonnaises/ligne-${num}.json`
		const response = await Promise.all(
			[...new Array(9)].map((_, i) => fetch(url(i + 1)))
		)

		const lines = await Promise.all(
			response.map((res) => {
				return res.json()
			})
		)

		const json = {
			type: 'FeatureCollection',
			features: lines.map((line) => line.features).flat(),
		}
		const result = {
			...json,
			features: json.features
				.filter(({ geometry }) => geometry.type === 'LineString')
				.map((f) => ({
					...f,
					properties: {
						...f.properties,
						color: lyonColors['' + f.properties.line],
					},
				})),
		}
		return result
	}
	if (name === 'Rennes Métropole') {
		return rennes
	}
	if (false && name === 'Rennes Métropole') {
		// Here, we donwloaded data from OSM directly through overpass. But REV are not mainstream yet, and it's probably better to use geojson for most of the lines are not yet completed, just political projects. It also enables any associative actor to propose plans to be intagrated here in villes.plus
		const requestCore = `
		 relation["cycle_network"="FR:REV"](area.searchArea);
`

		const data = request(name, requestCore)
		const url = encodeURI(`${OverpassInstance}?data=${data}`)

		try {
			console.log(`Will fetch ${requestCore} points for ${name}`)
			console.log(url)
			const response = await fetchRetry(url, {}, 5)
			const json = await response.json()
			const geoJSON = osmtogeojson(json)
			return geoJSON
		} catch (e) {
			console.log(`Error fetching and retry points for ${name}`, e)
		}
	}
	return
}
