import { OverpassInstance, request } from '@/../cyclingPointsRequests'
import { fetchRetry } from '@/../utils'
import osmtogeojson from 'osmtogeojson'

export default async (name) => {
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
		console.log(lines)

		const json = {
			type: 'FeatureCollection',
			features: lines.map((line) => line.features).flat(),
		}
		return {
			...json,
			features: json.features.filter(
				({ geometry }) => geometry.type === 'LineString'
			),
		}
	}
	if (name === 'Rennes Métropole') {
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
