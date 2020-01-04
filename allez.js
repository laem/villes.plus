import makeRequest from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'
import geojsonArea from '@mapbox/geojson-area'
import geojsonLength from 'geojson-length'
import buffer from '@turf/buffer'
import { polygon, featureCollection } from '@turf/helpers'
import union from '@turf/union'
import center from '@turf/center'
import mapshaper from 'mapshaper'

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
	let overpassRequest = makeRequest(city),
		request = `http://overpass.openstreetmap.fr/api/interpreter?data=${overpassRequest}`
	return fetch(encodeURI(request))
		.then(r => r.json())
		.then(async json => {
			console.log('json', json)
			let geojson = osmtogeojson(json)
			if (!geojson.features.length) {
				console.log('geojson', geojson)
				throw Error("La requête n'a rien renvoyé. Cette ville existe bien ?")
			}
			console.log('données OSM récupérées : ', city)

			let typesCount = countTypes(geojson)
			let polygons = linesToPolygons(geojson)
			let mergedPolygons0 = await mergePolygons2(polygons)

			let multiPolygon = mergedPolygons0.geometries[0]
			let mergedPolygons = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {
							stroke: '#555555',
							'stroke-width': 2,
							'stroke-opacity': 1,
							fill: '#981269',
							'fill-opacity': 0.5
						},
						geometry: multiPolygon
					}
				]
			}
			console.log('polygons merged')
			let cityScore = score(geojson)
			console.log('score computed')
			let result = {
				geojson,
				...cityScore,
				typesCount,
				center: center(geojson.features[0]),
				mergedPolygons,
				polygons,
				realArea: geojsonArea.geometry(mergedPolygons.features[0].geometry)
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
	let myunion = polygons
		.slice(1)
		.reduce(
			(memo, next, index) => console.log(index) || union(memo, next),
			polygons[0]
		)
	return myunion
}
const mergePolygons2 = async geojson => {
	let polygons = {
		...geojson,
		features: geojson.features.filter(f => f.geometry.type === 'Polygon')
	}

	const input = { 'input.geojson': polygons }
	const cmd =
		'-i input.geojson -dissolve2 -o out.geojson format=geojson rfc7946'

	const output = await mapshaper.applyCommands(cmd, input)
	return JSON.parse(output['out.geojson'].toString())
}
