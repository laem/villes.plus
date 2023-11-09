import point from 'turf-point'
import distance from '@turf/distance'

export default function (coordinates) {
	const result = coordinates.reduce(
		(memo, next) => {
			if (!memo.lastPoint) return { total: 0, lastPoint: next }
			const newDistance = distanceBetweenPoints(memo.lastPoint, next)

			return { total: memo.total + newDistance, lastPoint: next }
		},
		{ total: 0, lastPoint: null }
	)
	return result.total
}

const distanceBetweenPoints = (latLng, latLng2) => {
	var from = point(latLng)
	var to = point(latLng2)

	return distance(from, to)
}
