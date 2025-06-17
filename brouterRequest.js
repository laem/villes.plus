import http from 'http'
import https from 'https'

const host =
	process.env.LOCAL_ROUTER === 'true'
		? 'http://localhost:17777'
		: 'https://serveur.cartes.app'

export default (query) => {
	const url = `${host}/brouter?lonlats=${query}&profile=safety&alternativeidx=0&format=geojson`
	console.log('will fetch', query, url)

	/*
	// For a reason I don't get, after 30 min of searching, using my local brouter server fails with the fetch function for a malformed header reason...
	// see fetch code commented below
	requestHandler
		.get(url, (resp) => {
			let data = ''

			// Un morceau de réponse est reçu
			resp.on('data', (chunk) => {
				data += chunk
			})

			// La réponse complète à été reçue. On affiche le résultat.
			resp.on('end', () => {
			})
		})
		.on('error', (err) => {
			console.log('Error: ' + err.message)
		})

		else {
	*/
	return fetch(url)
		.then((response) => response.text())
		.then((data) => {
			console.log('did fetch from brouter', query)
			try {
				const json = JSON.parse(data)
				return json
			} catch (e) {
				if (data.includes('target island detected')) {
					console.log('🛑 caught error parsing locally', url, data)
					return null
				}
				if (data.includes('operation killed by thread-priority-watchdog')) {
					console.log('🛑 Cest le bouchon côté brouter on dirait', url, data)
					return null
				}
				if (data.includes('-position not mapped in existing datafile')) {
					console.log('🛑 Une erreur rare, je ne la comprends pas', url, data)
					return null
				}
				if (data.includes('no track found at pass=0')) {
					console.log(
						'🛑 Une autre erreur rare, je ne la comprends pas, rien sur internet',
						url,
						data
					)
					return null
				}
				if (data.includes('Application Error')) {
					console.log(
						'🛑 Scalingo retourne une erreur, peut-être car il reçoit trop de demandes pour les gérer.',
						url,
						data
					)
					return null
				}
				if (
					data.includes('The application took more than 30 seconds to respond')
				) {
					console.log(
						`🛑 Scalingo retourne une erreur, car il le serveur (sous l'eau ?) n'a pas répondu dans les 30 secondes à une requête`,
						url,
						data
					)
					return null
				}
				console.log('Uncaught brouter error', e)
				console.log(data)
				throw new Error('brouter call')
			}
			console.log('json', json)
			return json
		})
}
