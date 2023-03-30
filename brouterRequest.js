import http from 'http'

const host =
	process.env.NODE_ENV === 'production'
		? 'https://brouter.osc-fr1.scalingo.io'
		: 'http://localhost:17777'

export default (query, then) => {
	const url = `${host}/brouter?lonlats=${query}&profile=safety&alternativeidx=0&format=geojson`
	console.log('will fetch', query, url)

	// For a reason I don't get, after 30 min of searching, using my local brouter server fails with the fetch function for a malformed header reason...
	if (host.includes('localhost')) {
		http
			.get(url, (resp) => {
				let data = ''

				// Un morceau de réponse est reçu
				resp.on('data', (chunk) => {
					data += chunk
				})

				// La réponse complète à été reçue. On affiche le résultat.
				resp.on('end', () => {
					try {
						then(JSON.parse(data))
					} catch (e) {
						if (data.includes('target island detected')) {
							console.log('caught error parsing locally', url, data)
							return then(null)
						}
						console.log('Uncaught brouter error', e)
						console.log(data)
						throw new Error('brotuer')
					}
				})
			})
			.on('error', (err) => {
				console.log('Error: ' + err.message)
			})
	} else {
		fetch(url)
			.then((response) => {
				console.log('did fetch from brouter', query)
				const json = response.json()
				console.log('json', json)
				return json
			})
			.then((json) =>
				// do some work... this will only occur once per 5 minutes
				then(json)
			)
	}
}
