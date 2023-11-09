import isSafePath from './isSafePath'
import lineStringDistance from './lineStringDistance'

export default function (segments, safeExtension) {
	const { safe, unsafe } = segments.reduce(
		(memo, next) => {
			const coordinates = next.geometry.coordinates
			const segmentDistance = lineStringDistance(coordinates)
			const distance = segmentDistance * next.properties.rides.length
			const safe =
				isSafePath(next.properties.tags) ||
				(safeExtension && safeExtension(next.properties.tags))
			if (!safeExtension && safe !== next.properties.isSafePath)
				return new Error(
					"Le serveur et le client ne sont pas d'accord sur le caractère sécurisé du segment"
				)

			return {
				safe: memo.safe + (safe ? distance : 0),
				unsafe: memo.unsafe + (safe ? 0 : distance),
			}
		},
		{ safe: 0, unsafe: 0 }
	)

	return (safe / (safe + unsafe)) * 100
}
