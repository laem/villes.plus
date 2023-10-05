import { OverpassInstance, request } from '@/../cyclingPointsRequests'
import { fetchRetry } from '@/../utils'
import osmtogeojson from 'osmtogeojson'

export default async (name) => {
	if (name !== 'Rennes Métropole') return
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
