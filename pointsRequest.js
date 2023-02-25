const publicTransportRequestCore = `
  //node["amenity"="pharmacy"](area.searchArea);
//  node["shop"="bakery"](area.searchArea);
  node["public_transport"="stop_position"](area.searchArea);
`
const townhallsRequestCore = `
  node["amenity"="townhall"](area.searchArea);
  way["amenity"="townhall"](area.searchArea);
  relation["amenity"="townhall"](area.searchArea);
		`

export default async (city, then) => {
	try {
		const townhallResponse = await fetch(
				overpassRequestURL(city, townhallsRequestCore)
			),
			townhallPoints = await townhallResponse.json(),
			townhalls = clusterTownhallBorders(townhallPoints.elements)

		const transportStopsResponse = await fetch(
				overpassRequestURL(city, publicTransportRequestCore)
			),
			transportStopsRaw = await transportStopsResponse.json(),
			transportStops = shuffleArray(transportStopsRaw.elements).slice(0, 100)
		const points = [...townhalls, ...transportStops]
		then(points)
	} catch (e) {
		console.log("Problème de fetch de l'API", e)
	}
}
