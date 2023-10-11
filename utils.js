export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}
export const isTransportStop = (point) => point.tags.highway === 'bus_stop'
export const isTownhall = (point) => point.tags.amenity === 'townhall'

export function groupBy(list, keyGetter) {
	const map = new Map()
	list.forEach((item) => {
		const key = keyGetter(item)
		const collection = map.get(key)
		if (!collection) {
			map.set(key, [item])
		} else {
			collection.push(item)
		}
	})
	return Object.fromEntries(map)
}
export const fetchRetry = async (url, options, n) => {
	try {
		return await fetch(url, options)
	} catch (err) {
		console.log('Erreur', err)
		if (n === 1) throw err
		console.log('retry fetch points, ', n, ' try left')
		return await fetchRetry(url, options, n - 1)
	}
}

export const objectMap = (obj, fn) =>
	Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))
