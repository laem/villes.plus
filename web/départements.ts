import départements from './départements.yaml'
import osm from './départementsOSM.json'

const correspondanceManuelle = {
	Paris: 71525,
	Guadeloupe: 1047206,
	Martinique: 2473088,
	Guyane: 2502058,
	Mayotte: 3388394,
	Lyon: 4850450,
}
const result = départements
	.map((d) => {
		const found =
			correspondanceManuelle[d.nom] ||
			osm.elements.find((d2) => d2.tags.name === d.nom)
		if (!found) {
			console.log(d)
			throw new Error('Oupsoups')
		}
		const osmId = typeof found === 'number' ? found : found.id - 3600000000

		return { ...d, osmId }
	})
	.filter(Boolean)

export default result
