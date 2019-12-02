import makeRequest from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'
import geojsonArea from '@mapbox/geojson-area'

let countTypes = geoJson =>
	geoJson.features.reduce((memo, next) => {
		let t = next.geometry.type
		memo[t] = (memo[t] || 0) + 1
		return memo
	}, {})

let areas = geoJson => {
	let areas = geoJson.features
		.filter(f => f.geometry.type === 'Polygon')
		.map(f => geojsonArea.geometry(f.geometry))
	console.log('areas', areas)
	let total = areas.reduce((memo, next) => memo + next, 0)
	console.log(total)
}

let city = process.argv[2]

// Uselfull maybe to disambiguate or
let findCity = city =>
	fetch(
		`https://nominatim.openstreetmap.org/search/${city}?format=json&addressdetails=1&limit=1`
	).then(r => r.json())

let request = escape(makeRequest(city))
fetch(`
https://www.overpass-api.de/api/interpreter?data=${request}`)
	.then(r => r.json())
	.then(json => areas(osmtogeojson(json)))
