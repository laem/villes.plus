import bearing from '@turf/bearing'
import distance from '@turf/distance'
import point from 'turf-point'
import brouterRequest from './brouterRequest'
import isSafePath from './isSafePath'
import { computePointsCenter, pointsProcess } from './pointsRequest'
import { isTransportStop } from './utils'

const maxCityDistance = 20 // was used previously, but I think the next threshold is better

/* VERY IMPORTANT PARAM
 * 4 is a symbolic number : think of a compass
 * but any other number could be argued
 * the only limit is the server weight, and map lisibility
 * */
const nearestPointsLimit = 4
/* This is a daily cycling infra testing algorithm : we're not really interested in testing rides that
 * represent more than 25 km à vol d'oiseau.
 * 20 km is the approximate distance ridden by an electric bike in 45 minutes
 * considering the real distance is a little bit more than the point to point straight distance.
 * */

const maximumBikingDistance = 20

const createBikeRouterQuery = (from, to) =>
	encodeURIComponent(`${from.reverse().join(',')}|${to.reverse().join(',')}`)

const createItinerary = (from, to) => {
	const query = createBikeRouterQuery([from.lat, from.lon], [to.lat, to.lon])
	return brouterRequest(query).then((json) => {
		return {
			...json,
			fromPoint: from.id,
			toPoint: to.id,
			backboneRide: to.tags.amenity === 'townhall',
		}
	})
}

export const segmentGeoJSON = (brouterGeojson) => {
	const geojson = brouterGeojson
	if (geojson.features.length > 1) throw Error('Oulala pas prévu ça')
	const table = getMessages(geojson)
	const coordinateStringToNumber = (string) => +string / 10e5
	const getLineCoordinates = (line) =>
			line && [line[0], line[1]].map(coordinateStringToNumber),
		getLineDistance = (line) => line[3],
		getLineTags = (line) => line[9]

	const { toPoint, fromPoint, backboneRide } = geojson
	let mutableLineStringCoordinates = geojson.features[0].geometry.coordinates
	// As I understand this, the "messages" table contains brouter's real measurement of distance
	// in segments that are grouped, maybe according to tags ?
	// The LineString ('geometry') contains the real detailed shape
	// Important info for score calculation is contained in the table,
	// whereas important info for map display is contained in the LineString
	// from the first lineString coords to the first message coords (that correspond to another linestring coord), apply the properties of the message
	// ...
	// until the last lineString coord, apply the properties of the message, that goes way further in termes of coords but whose distance is right

	const featureCollection = {
		type: 'FeatureCollection',
		features: table.map((line, i) => {
			const [lon, lat] = getLineCoordinates(line)

			const [coordinates, nextCoordinates] = computeFeatureCoordinates(
				mutableLineStringCoordinates,
				lon,
				lat
			)
			mutableLineStringCoordinates = nextCoordinates

			return {
				type: 'Feature',
				properties: {
					tags: getLineTags(line),
					distance: line[3],
					elevation: line[2],
					backboneRide,
					isSafePath: isSafePath(getLineTags(line)),
					toPoint,
					fromPoint,
				},
				geometry: {
					type: 'LineString',
					coordinates,
				},
			}
		}),
	}
	return featureCollection
}

const computeFeatureCoordinates = (lineStringCoordinates, lon, lat) => {
	let selected = [],
		future = []

	let i = 0
	for (const next of lineStringCoordinates) {
		i += 1
		const [lon2, lat2] = next
		selected.push(next)
		const foundBoundary = lon2 == lon && lat2 == lat
		if (foundBoundary) {
			future = lineStringCoordinates.slice(i)
			break
		}
	}

	return [selected, future]
}

export const getMessages = (geojson) => {
	const [_, ...table] = geojson.features[0].properties.messages

	return table
}
export const computeSafePercentage = (messages) => {
	const [safeDistance, total] = messages.reduce(
		(memo, next) => {
			const safe = isSafePath(next[9]),
				distance = next[3]
			return [memo[0] + (safe ? +distance : 0), memo[1] + +distance]
		},
		[0, 0]
	)

	return (safeDistance / total) * 100
}

const roseDirections = ['sud-ouest', 'nord-ouest', 'nord-est', 'sud-est']
const computeRoseDirection = (bearing) =>
	bearing < -90
		? 'sud-ouest'
		: bearing < 0
		? 'nord-ouest'
		: bearing < 90
		? 'nord-est'
		: 'sud-est'
export const createRidesPromises = (points) =>
	points
		.map((p, i) => {
			const point1 = point([p.lon, p.lat])

			const nearestPoints = points
				.map((p2) => {
					const point2 = point([p2.lon, p2.lat])
					const d = distance(point2, point1)

					const notSame =
						p != p2 && // suffices for now, it's binary
						isTransportStop(p) === isTransportStop(p2) &&
						// don't consider the sibling bus stop for the other bus direction
						!(d < 1 && p.tags.name === p2.tags.name)
					const pointBearing = bearing(point1, point2),
						roseDirection = computeRoseDirection(pointBearing)
					return { point: p2, d, notSame, roseDirection }
				})
				.filter((p) => p.notSame)
				.sort((pa, pb) => pa.d - pb.d)

			const firstX = nearestPoints
				.slice(0, nearestPointsLimit)
				.map((p) => p.point)

			const mostInterestingXPoints = nearestPoints
				.reduce((memo, next) => {
					if (memo.length === nearestPointsLimit) return memo
					return memo.find(
						(element) => element.roseDirection === next.roseDirection
					)
						? memo
						: next.d < maximumBikingDistance
						? [...memo, next]
						: memo
				}, [])
				.map((p) => p.point)

			return mostInterestingXPoints.map((p2, j) =>
				new Promise((resolve) =>
					setTimeout(resolve, itineraryRequestDelay * (i + j))
				).then(() => createItinerary(p, p2))
			)
		})
		.flat()

const itineraryRequestDelay = 120 // This is fined tuned to handle the brouter server on my computer. It can fail requests at 100

export const isValidRide = (ride) =>
	// Exclude itineraries that include a ferry route.
	// TODO maybe we should just exclude the subrides that are ferry ? Doesn't matter much on the final result
	ride &&
	ride.features &&
	!getMessages(ride).some((ride) => ride[9].includes('route=ferry'))

export default async (ville, inform = () => null, scope) => {
	inform({ loading: `Les points vont être téléchargés pour ${scope} ${ville}` })
	const points = await pointsProcess(ville)
	inform({ loading: `Points téléchargés : ${points.length} points` })
	const pointsCenter = computePointsCenter(points)

	let resolvedPromisesCount = 0
	const ridesPromises = createRidesPromises(points)
	ridesPromises.map((promise) =>
		promise.then(() => {
			resolvedPromisesCount += 1

			if (resolvedPromisesCount % 10 === 0)
				inform({ loading: `🧭 ${resolvedPromisesCount} itinéraires calculés` })
		})
	)
	const rides = await Promise.all(ridesPromises)

	const filteredRides = rides.filter(isValidRide)

	const score = computeSafePercentage(
		filteredRides.map((ride) => getMessages(ride)).flat()
	)

	const segments = filteredRides
		.map((ride) => segmentGeoJSON(ride))
		.map((r) => r.features)
		.flat()

	const result = { pointsCenter, points, segments, score, rides }
	inform({ data: result })
	return result
}
