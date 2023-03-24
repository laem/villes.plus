const omitUselessProperties = (object) => {
	const {
		distance,
		elevation,
		weight,
		opacity,
		toPoint,
		fromPoint,
		dashArray,
		...result
	} = object

	return result
}

const coordinatesHash = (s) =>
	s.geometry.coordinates.map((point) => point.join(',')).join(',')
const compressSegments = (segments) => {
	const duplicateGeometrySegments = segments.reduce((memo, s, i) => {
		const hash = coordinatesHash(s)
		return { ...memo, [hash]: [...(memo[hash] || []), s] }
	}, {})

	const result = Object.entries(duplicateGeometrySegments).map(
		([hash, values]) => ({
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: values[0].geometry.coordinates.map(
					(point) => point.slice(0, 2) // remove elevation, useless
				),
			},
			properties: {
				...omitUselessProperties(values[0].properties),
				rides: values.map((v) => [
					v.properties.toPoint,
					v.properties.fromPoint,
					v.properties.backboneRide,
				]),
			},
		})
	)
	return result
}
export default {
	cycling: [
		[
			'meta', // get data only for the front page, lightweight request
			({ score }) => ({
				score,
			}),
		],
		[
			'merged', //all the above, plus data to visualise the merged polygon from which the area is computed
			({
				points,
				segments,
				score,
				pointsCenter,
				rides,
				compressedSegments,
			}) => ({
				points,
				//segments,
				segments: compressedSegments ? segments : compressSegments(segments),
				compressedSegments: true,
				score,
				pointsCenter,
				ridesLength: rides.length,
			}),
		],
		[
			'complete', // not implemented yet
			({}) => ({}),
		],
	],

	walking: [
		[
			'meta', // get data only for the front page, lightweight request
			(
				{
					pedestrianArea,
					relativeArea,
					meanStreetWidth,
					streetsWithWidthCount,
				},
				geoAPI
			) => ({
				pedestrianArea,
				relativeArea,
				meanStreetWidth,
				streetsWithWidthCount,
				geoAPI,
			}),
		],
		[
			'merged', //all the above, plus data to visualise the merged polygon from which the area is computed
			(
				{
					mergedPolygons,
					pedestrianArea,
					relativeArea,
					meanStreetWidth,
					streetsWithWidthCount,
				},
				geoAPI
			) => ({
				mergedPolygons,
				relativeArea,
				meanStreetWidth,
				streetsWithWidthCount,
				pedestrianArea,
				geoAPI,
			}),
		],
		[
			'complete', // all the above, plus all the polygons, to debug the request result and exclude shapes on the website
			({ polygons }, geoAPI) => ({ polygons, geoAPI }),
		],
	],
}
