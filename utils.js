export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}
export const isTransportStop = (point) => point.tags.highway === 'bus_stop'
export const isTownhall = (point) => point.tags.amenity === 'townhall'
