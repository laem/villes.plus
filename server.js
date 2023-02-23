import express from 'express'
import { compute } from './geoStudio.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import compression from 'compression'
import villes from './villesClassées'
import fetchExceptions from './fetchExceptions'
import apicache from 'apicache'
import AWS from 'aws-sdk'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import computeCycling from './computeCycling'
import { overpassRequestURL } from './cyclingPointsRequests'
import { shuffleArray } from './utils'
import http from 'http'

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
	const data = await s3
		.getObject({
			Bucket: BUCKET_NAME,
			Key: 'yo.txt',
		})
		.promise()

	console.log(`Successfully read test file from ${BUCKET_NAME}`)

	console.log(`<<${data.Body.toString('utf-8')}>>`)
}

testStorage()

const cacheDir = __dirname + '/cache'

if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir)
}

const app = express()
app.use(cors())
app.use(compression())

app.use(express.static(__dirname))
const cache = apicache.options({
	headers: {
		'cache-control': 'no-cache',
	},
	debug: true,
}).middleware

const host = 'http://localhost:17777'
//const host = 'https://brouter.de'

app.get('/bikeRouter/:query', cache('1 day'), (req, res) => {
	const { query } = req.params
	const url = `${host}/brouter?lonlats=${query}&profile=safety&alternativeidx=0&format=geojson`
	console.log('will fetch', query, url)
		
		// For a reason I don't get, after 30 min of searching, using my local brouter server fails with the fetch function for a malformed header reason...
		if (host.includes('localhost')) {
http.get(url, (resp) => {
  let data = '';

  // Un morceau de réponse est reçu
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // La réponse complète à été reçue. On affiche le résultat.
  resp.on('end', () => {
		  try {
    res.json(JSON.parse(data))
		  } catch (e) {console.log('error parsing locally', url)
				  console.log(e)

		  }

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});


}else {
	fetch(url)
		.then((response) => {
			console.log('did fetch from brouter', query)
			const json = response.json()
			console.log('json', json)
			return json
		})
		.then((json) =>
			// do some work... this will only occur once per 5 minutes
			res.json(json)
		)
}
})

app.get('/points/:city', cache('1 day'), (req, res) => {
	const { city } = req.params

	fetch(
		overpassRequestURL(
			city,
			`
  //node["amenity"="pharmacy"](area.searchArea);
//  node["shop"="bakery"](area.searchArea);
  node["public_transport"="stop_position"](area.searchArea);

			`
		)
	)
		.then((res) => res.json())
		.then((json) => {
			console.log(json.elements.length)
			const allPoints = json.elements
				console.log('number of points for', city)

			const points = shuffleArray(allPoints).slice(0, 100)

			res.json({ elements: points })
		})
		.catch((e) => console.log("Problème de fetch de l'API", e))

	return
	const requestCore = `
  node["amenity"="townhall"](area.searchArea);
  way["amenity"="townhall"](area.searchArea);
  relation["amenity"="townhall"](area.searchArea);
		`
	const myRequest = overpassRequestURL(city, requestCore)
	fetch(myRequest)
		.then((response) => {
			console.log('did fetch from overpass', city)
			return response.json()
		})
		.then((json) =>
			// do some work... this will only occur once per 5 minutes
			res.json(json)
		)
})

const scopes = {
	cycling: [
		[
			'meta', // get data only for the front page, lightweight request
			({ score }) => ({
				score,
			}),
		],
		[
			'merged', //all the above, plus data to visualise the merged polygon from which the area is computed
			({ points, segments, score, pointsCenter }) => ({
				points,
				segments,
				score,
				pointsCenter,
			}),
		],
		[
			'complete', // not implemented yet
			({}) => ({}),
		],
	],

	walking: [
		[
			'meta', // get data only for the front page, lightweight request
			(
				{
					pedestrianArea,
					relativeArea,
					meanStreetWidth,
					streetsWithWidthCount,
				},
				geoAPI
			) => ({
				pedestrianArea,
				relativeArea,
				meanStreetWidth,
				streetsWithWidthCount,
				geoAPI,
			}),
		],
		[
			'merged', //all the above, plus data to visualise the merged polygon from which the area is computed
			(
				{
					mergedPolygons,
					pedestrianArea,
					relativeArea,
					meanStreetWidth,
					streetsWithWidthCount,
				},
				geoAPI
			) => ({
				mergedPolygons,
				relativeArea,
				meanStreetWidth,
				streetsWithWidthCount,
				pedestrianArea,
				geoAPI,
			}),
		],
		[
			'complete', // all the above, plus all the polygons, to debug the request result and exclude shapes on the website
			({ polygons }, geoAPI) => ({ polygons, geoAPI }),
		],
	],
}

const getDirectory = () =>
	new Date()
		.toLocaleString('fr-FR', { month: 'numeric', year: 'numeric' })
		.replace('/', '-')

const readFile = async (dimension, ville, scope, res) => {
	return computeAndCacheCity(dimension, ville, scope, res, true)
	return
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

		let data = JSON.parse(content)
		res && res.json(data)
	} catch (e) {
		computeAndCacheCity(dimension, ville, scope, res)
	}
}
const computeAndCacheCity = async (
	dimension,
	ville,
	returnScope,
	res,
	doNotCache
) => {
	console.log('ville pas encore connue : ', ville)
	fetchExceptions().then((exceptions) =>
		(dimension === 'walking' ? compute(ville) : computeCycling(ville))
			.then(({ geoAPI, ...data }) => {
				scopes[dimension].map(async ([scope, selector]) => {
					const string = JSON.stringify(selector(data, geoAPI))

					try {
						if (!doNotCache) {
							const file = await s3
								.upload({
									Bucket: BUCKET_NAME,
									Key: `${getDirectory()}/${ville}.${scope}${
										dimension === 'cycling' ? '.cycling' : ''
									}.json`,
									Body: string,
								})
								.promise()

							console.log('Fichier écrit :', ville, scope)
						}
						if (returnScope === scope) res && res.json(JSON.parse(string))
					} catch (err) {
						console.log(err) || (res && res.status(400).end())
					}
				})
			})
			.catch((e) => console.log(e))
	)
}

let resUnknownCity = (res, ville) =>
	res &&
	res.status(404).send('Ville inconnue <br/> Unknown city').end() &&
	console.log('Unknown city : ' + ville)

app.get('/api/:dimension/:scope/:ville', cache('1 day'), function (req, res) {
	const { ville, scope, dimension } = req.params
	console.log('api: ', dimension, ville, scope)
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
