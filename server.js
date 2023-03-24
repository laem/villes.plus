import apicache from 'apicache'
import AWS from 'aws-sdk'
import compression from 'compression'
import cors from 'cors'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
import path from 'path'
import brouterRequest from './brouterRequest'
import computeCycling from './computeCycling'
import { overpassRequestURL } from './cyclingPointsRequests'
import { compute } from './geoStudio.js'
import villes from './villesClassées'
import algorithmVersion from './algorithmVersion'
import { writeFileSyncRecursive } from './nodeUtils'
import scopes from './scopes'

dotenv.config()

const BUCKET_NAME = process.env.BUCKET_NAME
const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL
const ID = process.env.ACCESS_KEY_ID
const SECRET = process.env.ACCESS_KEY

// Create S3 service object
const s3 = new AWS.S3({
	endpoint: S3_ENDPOINT_URL,
	credentials: {
		accessKeyId: ID,
		secretAccessKey: SECRET,
	},
})

const testStorage = async () => {
	try {
		const data = await s3
			.getObject({
				Bucket: BUCKET_NAME,
				Key: 'yo.txt',
			})
			.promise()

		console.log(
			`Successfully read test file from ${BUCKET_NAME} : S3 storage works.`
		)

		console.log(`<<${data.Body.toString('utf-8')}>>`)
	} catch (e) {
		console.log('Problem fetching S3 test object', e)
	}
}

testStorage()

const app = express()
app.use(cors())
app.use(compression())

app.use(express.static(__dirname))

const cache = apicache.options({
	headers: {
		'cache-control': 'no-cache',
	},
	debug: false,
}).middleware

app.get('/bikeRouter/:query', cache('1 day'), (req, res) => {
	const { query } = req.params
	brouterRequest(query, (json) => res.json(json))
})

const fetchRetry = async (url, options, n) => {
	try {
		return await fetch(url, options)
	} catch (err) {
		if (n === 1) throw err
		console.log('retry fetch points, ', n, ' try left')
		return await fetchRetry(url, options, n - 1)
	}
}

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

const getDirectory = () => {
	const date = new Date()
		.toLocaleString('fr-FR', { month: 'numeric', year: 'numeric' })
		.replace('/', '-')
	return `${date}/${algorithmVersion}`
}

const doNotCache = true
const readFile = async (dimension, ville, scope, res) => {
	const compute = () =>
		computeAndCacheCity(dimension, ville, scope, res, doNotCache)
	if (doNotCache) return compute()
	try {
		const file = await s3
			.getObject({
				Bucket: BUCKET_NAME,
				Key: `${getDirectory()}/${ville}.${scope}${
					dimension === 'cycling' ? '.cycling' : ''
				}.json`,
			})
			.promise()

		const content = file.Body.toString('utf-8')
		console.log('les meta sont déjà là pour ' + ville)

		let data = JSON.parse(content),
			filteredData = scopes[dimension].find(
				([name, selector]) => name === scope
			)[1](data)
		res && res.json(filteredData)
	} catch (e) {
		console.log('No meta found, unknown territory')
		compute()
	}
}
let computingLock = []

const computeAndCacheCity = async (
	dimension,
	ville,
	returnScope,
	res,
	doNotCache
) => {
	const intervalId = setInterval(() => {
		if (computingLock.length > 0) {
			console.log(
				computingLock,
				' already being processed, waiting for...',
				ville
			)
		} else {
			computingLock = [...computingLock, ville + dimension]
			clearInterval(intervalId)
			return (dimension === 'walking' ? compute(ville) : computeCycling(ville))
				.then(({ geoAPI, ...data }) => {
					scopes[dimension].map(async ([scope, selector]) => {
						const string = JSON.stringify(selector(data, geoAPI))

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
								computingLock = computingLock.filter(
									(el) => el != ville + dimension
								)
							}
						} catch (err) {
							console.log('removing lock for ', ville + dimension)
							computingLock = computingLock.filter(
								(el) => el != ville + dimension
							)
							console.log(err) || (res && res.status(400).end())
						}
					})
				})
				.catch((e) => console.log(e))
		}
	}, 10000)
	console.log('ville pas encore connue : ', ville)
}

let resUnknownCity = (res, ville) =>
	res &&
	res.status(404).send('Ville inconnue <br/> Unknown city').end() &&
	console.log('Unknown city : ' + ville)

app.get('/api/:dimension/:scope/:ville', cache('1 day'), function (req, res) {
	const { ville, scope, dimension } = req.params
	console.log('API request : ', dimension, ville, ' for the ', scope, ' scope')
	readFile(dimension, ville, scope, res)
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})

let port = process.env.PORT || 3000
app.listen(port, function () {
	console.log(
		'Allez là ! Piétonniez les toutes les villles  ! Sur le port ' + port
	)

	return // too many requests at once
	villes.map((ville, i) =>
		// settimeout needed, the overpass API instances can raise a "too many requests" error
		setTimeout(() => readFile('walking', ville, 'complete', null), i * 10000)
	)
})
