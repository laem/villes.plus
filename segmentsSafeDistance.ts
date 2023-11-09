import isSafePath from './isSafePath'
import lineStringDistance from './lineStringDistance'

export default function (segments) {
	const { safe, unsafe } = segments.reduce(
		(memo, next) => {
			const coordinates = next.geometry.coordinates
			const segmentDistance = lineStringDistance(coordinates)
			const distance = segmentDistance * next.properties.rides.length
			const safe = isSafePath(next.properties.tags)

			return {
				safe: memo.safe + (safe ? distance : 0),
				unsafe: memo.unsafe + (safe ? 0 : distance),
			}
		},
		{ safe: 0, unsafe: 0 }
	)

	return (safe / unsafe) * 100
}
