import makeRequest from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'
import geojsonArea from '@mapbox/geojson-area'
import geojsonLength from 'geojson-length'
import buffer from '@turf/buffer'
import { polygon, featureCollection } from '@turf/helpers'
import union from '@turf/union'
import center from '@turf/center'
import difference from '@turf/difference'
import mapshaper from 'mapshaper'
import { partition } from 'ramda'

const countTypes = features =>
	features.reduce((memo, next) => {
		const t = next.geometry.type
		memo[t] = (memo[t] || 0) + 1
		return memo
	}, {})

const score = geoJson => {
	const areas = geoJson.features
		.filter(f => f.geometry.type === 'Polygon')
		.map(f => geojsonArea.geometry(f.geometry))

	const areasLength = areas.length
	const totalAreas = areas.reduce((memo, next) => memo + next, 0)
	const lines = geoJson.features
		.filter(f => f.geometry.type === 'LineString')
		.map(f => geojsonLength(f.geometry))
	const linesLength = lines.length
	const totalLinesLength = lines.reduce((memo, next) => memo + next, 0)
	const totalLinesArea = totalLinesLength * 5 // we arbitrarily define the average width of a pedestrian street to 5 meters
	const totalTotal = totalLinesArea + totalAreas
	return {
		areasLength,
		totalAreas,
		linesLength,
		totalLinesArea,
		totalTotal
	}
}

// Usefull in the future to disambiguate with a UI
const findCity = ville =>
	fetch(
		`https://nominatim.openstreetmap.org/search/${ville}?format=json&addressdetails=1&limit=1`
	).then(r => r.json())

export const compute = (ville, exceptions) => {
	const overpassRequest = makeRequest(ville),
		request = `http://overpass.openstreetmap.fr/api/interpreter?data=${overpassRequest}`

	return (
		Promise.all([
			fetch(encodeURI(request)).then(res => res.json()),

			fetch(
				`https://geo.api.gouv.fr/communes?nom=${ville}&fields=surface,departement,centre,contour&format=json&boost=population`
			).then(res => res.json())
		])
			// we dangerously take the first element of the geo.api results array, since it's ranked by population and we're only working with the biggest french cities for now
			.then(async ([osm, [geoAPI]]) => {
				const geojson = osmtogeojson(osm)
				const features = geojson.features
				if (!features.length) {
					console.log('geojson', geojson)
					throw Error("La requête n'a rien renvoyé. Cette ville existe bien ?")
				}
				console.log('données OSM récupérées : ', ville)

				const typesCount = countTypes(features)
				const polygons = linesToPolygons(features)

				const [red, green] = partition(
					polygon => (exceptions[ville] || []).includes(polygon.id),
					polygons
				)
				console.log([green, red, polygons].map(e => e.length))
				const mergedPolygons0 = await mergePolygons2(green)
				const excluded = red.length ? await mergePolygons2(red) : []

				const mergedPolygons = {
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
							geometry: mergedPolygons0.geometries[0]
						}
					]
				}
				console.log('polygons merged')
				// const cityScore = score(geojson)
				const result = {
					geoAPI,
					mergedPolygons,
					realArea: geojsonArea.geometry(mergedPolygons.features[0].geometry),
					//the following is for debug purposes, in case the mergedPolygons and realArea are suspected to be not reliable,
					polygons
					//...cityScore,
					//typesCount,
					//geojson,
				}
				return result
			})
	)
}

export const linesToPolygons = features => {
	const standardWidth = 0.005,
		result = features.map(f =>
			f.geometry.type === 'LineString' ? buffer(f, standardWidth) : f
		)
	return result
}

// The result of the above OSM request is a massive set of shapes
// It can contain a footway in a park, and a park, that obvioulsy overlap
// This is a problem for data transmission (useless JSON weight)
// and especially for the area calculation, hence this deduplication of areas
// At this point, all lineStrings have been converted to Polygons,
// and we're not interested by points yet

// inefficient version
export const mergePolygons = geojson => {
	const polygons = geojson.features
		.filter(f => f.geometry.type === 'Polygon')
		.map(f => polygon(f.geometry.coordinates))
	const myunion = polygons
		.slice(1)
		.reduce(
			(memo, next, index) => console.log(index) || union(memo, next),
			polygons[0]
		)
	return myunion
}
// efficient version with mapshaper
const mergePolygons2 = async polygons => {
	const geojson = {
		type: 'FeatureCollection',
		features: polygons.filter(p => p.geometry.type === 'Polygon')
	}
	const input = { 'input.geojson': geojson }
	const cmd =
		'-i input.geojson -dissolve2 -o out.geojson format=geojson rfc7946'

	const output = await mapshaper.applyCommands(cmd, input)
	return JSON.parse(output['out.geojson'].toString())
}
