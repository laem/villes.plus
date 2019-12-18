import makeRequest from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'
import geojsonArea from '@mapbox/geojson-area'
import geojsonLength from 'geojson-length'
import buffer from '@turf/buffer'

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

	let areasLength = areas.length
	let totalAreas = areas.reduce((memo, next) => memo + next, 0)
	let lines = geoJson.features
		.filter(f => f.geometry.type === 'LineString')
		.map(f => geojsonLength(f.geometry))
	let linesLength = lines.length
	let totalLinesLength = lines.reduce((memo, next) => memo + next, 0)
	let totalLinesArea = totalLinesLength * 5 // we arbitrarily define the average width of a pedestrian street to 5 meters
	let totalTotal = totalLinesArea + totalAreas
	return {
		areasLength,
		totalAreas,
		linesLength,
		totalLinesArea,
		totalTotal
	}
}

// Uselfull maybe to disambiguate or
let findCity = city =>
	fetch(
		`https://nominatim.openstreetmap.org/search/${city}?format=json&addressdetails=1&limit=1`
	).then(r => r.json())

export let compute = (city, callback) => {
	let request = escape(makeRequest(city))
	fetch(`
https://www.overpass-api.de/api/interpreter?data=${request}`)
		.then(r => r.json())
		.then(json => {
			let geojson = osmtogeojson(json)

			let typesCount = countTypes(geojson)
			let cityScore = score(geojson)
			callback({ geojson, ...cityScore, typesCount })
		})
}

export let linesToPolygons = geojson => {
	let standardWidth = 0.005,
		geojson2 = {
			...geojson,
			features: geojson.features.map(f =>
				f.geometry.type === 'LineString' ? buffer(f, standardWidth) : f
			)
		}
	return geojson2
}
