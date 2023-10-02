import apicache from 'apicache'
import compression from 'compression'
import cors from 'cors'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
import path from 'path'
import brouterRequest from './brouterRequest'
import computeCycling from './computeCycling'
import { overpassRequestURL } from './cyclingPointsRequests'
import { compute as computeWalking } from './geoStudio.js'

import { Server } from 'socket.io'
import { previousDate } from './algorithmVersion'
import { writeFileSyncRecursive } from './nodeUtils'
import scopes from './scopes'
import { BUCKET_NAME, getDirectory, s3, testStorage } from './storage'
import { fetchRetry } from './utils'
dotenv.config()

testStorage()

const app = express()
app.use(
	cors({
		origin: '*',
	})
)
app.use(compression())

let port = process.env.PORT

const httpServer = app.listen(port, function () {
	console.log(
		'Allez là ! Piétonniez les toutes les villles  ! Sur le port ' + port
	)
})

const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
})

const cache = apicache.options({
	headers: {
		'cache-control': 'no-cache',
	},
	debug: false,
}).middleware

console.log('io initialisaed')

io.on('connection', (socket) => {
	console.log('a user connected')
	socket.on('message-socket-initial', () =>
		console.log('message socket initial bien reçu !')
	)
	socket.on('api', ({ dimension, scope, ville, directory }) => {
		console.log(
			'socket message API received',
			dimension,
			scope,
			ville,
			directory
		)
		const inform = (message) => {
			console.log('will server emit', message)
			const path = `api/${dimension}/${scope}/${ville}/${directory}`
			console.log('path', path)
			if (message.data) apicache.clear('/' + path)
			io.emit(path, message)
		}
		computeAndCacheCity(dimension, ville, scope, null, null, inform)
	})
})

app.get('/bikeRouter/:query', cache('1 day'), (req, res) => {
	const { query } = req.params
	brouterRequest(query, (json) => res.json(json))
})

app.get('/points/:city/:requestCore', cache('1 day'), async (req, res) => {
	const { city, requestCore } = req.params

	try {
		console.log(`Will fetch ${requestCore} points for ${city}`)
		const response = await fetchRetry(
			overpassRequestURL(city, requestCore),
			{},
			5
		)
		const json = await response.json()
		res.json(json)
	} catch (e) {
		res.send(`Error fetching and retry points for ${city}`, e)
	}
})

const readFile = async (dimension, ville, scope, directory) => {
	if (!directory)
		throw new Error(`Le paramètre directory (date + version) est nécessaire`)
	try {
		console.log('Will try to retrieve s3 data for ', ville, scope)
		const key = `${directory}/${ville}.${scope}${
			dimension === 'cycling' ? '.cycling' : ''
		}.json`
		console.log('key', key)
		console.log('dimension', dimension)
		const file = await s3
			.getObject({
				Bucket: BUCKET_NAME,
				Key: key,
			})
			.promise()

		const content = file.Body.toString('utf-8')
		console.log('les meta sont déjà là pour ' + ville)

		console.log('will parse and filter data from S3', ville, scope)
		let data = JSON.parse(content),
			filteredData = scopes[dimension].find(
				([name, selector]) => name === scope
			)[1](data)
		return filteredData
	} catch (e) {
		const message = "Ce territoire n'est pas encore calculé"
		console.log(message)
		return { message }
	}
}

let computingLock = []

const removeLock = (ville, dimension) => {
	computingLock = computingLock.filter((el) => el != ville + dimension)
}
const addLock = (ville, dimension) => {
	computingLock = [...computingLock, ville + dimension]
}

const waitingForLockInterval = 10000

const computeAndCacheCity = async (
	dimension,
	ville,
	returnScope,
	res,
	doNotCache,
	inform
) => {
	const intervalId = setInterval(() => {
		if (computingLock.length > 0) {
			console.log(
				computingLock,
				' already being processed, waiting for...',
				ville
			)
		} else {
			addLock(ville, dimension)
			clearInterval(intervalId)
			return (
				dimension === 'walking'
					? computeWalking(ville, inform)
					: computeCycling(ville, inform)
			)
				.then((data) => {
					scopes[dimension].map(async ([scope, selector]) => {
						const string = JSON.stringify(selector(data))

						try {
							if (!doNotCache) {
								const fileName = `${getDirectory()}/${ville}.${scope}${
									dimension === 'cycling' ? '.cycling' : ''
								}.json`
								try {
									writeFileSyncRecursive(
										`${__dirname}/cache/${fileName}`,
										string
									)
									// fichier écrit avec succès
								} catch (err) {
									console.error(
										"Erreur dans l'écriture du fichier localement",
										fileName,
										err
									)
								}
								const file = await s3
									.upload({
										Bucket: BUCKET_NAME,
										Key: fileName,
										Body: string,
									})
									.promise()

								console.log('Fichier écrit :', ville, scope)
							}
							if (returnScope === scope) {
								res && res.json(JSON.parse(string))
								removeLock(ville, dimension)
							}
						} catch (err) {
							console.log('removing lock for ', ville + dimension)
							removeLock(ville, dimension)
							console.log(err) || (res && res.status(400).end())
						}
					})
				})
				.catch((e) => {
					removeLock(ville, dimension)
					console.log(e)
				})
		}
	}, waitingForLockInterval)
	console.log('territoire pas encore connu : ', ville)
}

let resUnknownCity = (res, ville) =>
	res &&
	res.status(404).send('Ville inconnue <br/> Unknown city').end() &&
	console.log('Unknown city : ' + ville)

app.get(
	'/api/:dimension/:scope/:ville/:date/:algorithmVersion',
	cache('1 day'),
	async function (req, res) {
		const { ville, scope, dimension, date, algorithmVersion } = req.params
		console.log(
			'API request : ',
			dimension,
			ville,
			' for the ',
			scope,
			' scope',
			'for the date ',
			date
		)
		if (!date)
			throw new Error(
				`Le directory (date + version algo) est maintenant requise dans l'appel à l'API`
			)
		console.log('Will read ', dimension, ville, scope, date, algorithmVersion)
		const data = await readFile(
			dimension,
			ville,
			scope,
			date + '/' + algorithmVersion
		)

		if (data.message) return res.status(202).send(data).end()

		if (scope !== 'meta') return res.json(data)

		const previousData = await readFile(
			dimension,
			ville,
			scope,
			previousDate,
			algorithmVersion
		)

		return res.json({
			...data,
			previousData: previousData.score && {
				date: previousDate,
				score: previousData.score,
			},
		})
	}
)

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})
