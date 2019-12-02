import makeRequest from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'
import geojsonArea from '@mapbox/geojson-area'
import geojsonLength from 'geojson-length'

let countTypes = geoJson =>
	geoJson.features.reduce((memo, next) => {
		let t = next.geometry.type
		memo[t] = (memo[t] || 0) + 1
		return memo
	}, {})

let score = geoJson => {
	let areas = geoJson.features
		.filter(f => f.geometry.type === 'Polygon')
		.map(f => geojsonArea.geometry(f.geometry))
	console.log('areas', areas.length)
	let totalAreas = areas.reduce((memo, next) => memo + next, 0)
	console.log('totalAreas', totalAreas / 1000)
	let lines = geoJson.features
		.filter(f => f.geometry.type === 'LineString')
		.map(f => geojsonLength(f.geometry))
	console.log('lines', lines.length)
	let totalLinesLength = lines.reduce((memo, next) => memo + next, 0)
	let totalLinesArea = totalLinesLength * 5 // we arbitrarily define the average width of a pedestrian street to 5 meters
	console.log('totalLineAreas', totalLinesArea / 1000)
	console.log('totaltotal', (totalLinesArea + totalAreas) / 1000)
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
	.then(json => {
		let geojson = osmtogeojson(json)
		console.log(countTypes(geojson))
		score(geojson)
	})
