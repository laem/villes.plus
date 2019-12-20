import makeRequest from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'
import geojsonArea from '@mapbox/geojson-area'
import geojsonLength from 'geojson-length'
import buffer from '@turf/buffer'
import { polygon, featureCollection } from '@turf/helpers'
import union from '@turf/union'
import center from '@turf/center'

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

export let compute = city => {
	let overpassRequest = escape(makeRequest(city)),
		request = `http://overpass.openstreetmap.fr/api/interpreter?data=${overpassRequest}`
	console.log(request)

	return fetch(request)
		.then(r => r.json())
		.then(json => {
			let geojson = osmtogeojson(json)

			let typesCount = countTypes(geojson)
			let cityScore = score(geojson)
			let result = {
				geojson,
				...cityScore,
				typesCount,
				center: center(geojson.features[0]),
				geojson3: mergePolygons(geojson)
			}
			return result
		})
}

export let linesToPolygons = geojson => {
	let standardWidth = 0.005,
		newJson = {
			...geojson,
			features: geojson.features.map(f =>
				f.geometry.type === 'LineString' ? buffer(f, standardWidth) : f
			)
		}
	return newJson
}

// The result of the request is a massive set of polygons
// There can be a way in a park, sharing a common area.
// This is a problem for data transmission (useless JSON weight)
// and for the area calculation, hence this deduplication of areas
// At this point, all lineStrings have been converted to Polygons,
// and we're not interested by points yet
export let mergePolygons = geojson => {
	let polygons = geojson.features
		.filter(f => f.geometry.type === 'Polygon')
		.map(f => polygon(f.geometry.coordinates))
	let myunion = polygons.slice(1).reduce(union, polygons[0])
	return myunion
}
