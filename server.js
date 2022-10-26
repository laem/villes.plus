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

	console.log(
		`Successfully read test file from ${BUCKET_NAME}`,
		`<<${data.Body.toString('utf-8')}>>`
	)
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

app.get('/bikeRouter/:query', cache('1 day'), (req, res) => {
	const { query } = req.params
	fetch(
		`https://brouter.de/brouter?lonlats=${query}&profile=safety&alternativeidx=0&format=geojson`
	)
		.then((response) => {
			console.log('did fetch from brouter', query)
			return response.json()
		})
		.then((json) =>
			// do some work... this will only occur once per 5 minutes
			res.json(json)
		)
})

const request = (name) => `

[out:json][timeout:25];
( area[name="${name}"]; )->.searchArea;
(
  node["amenity"="townhall"](area.searchArea);
  way["amenity"="townhall"](area.searchArea);
  relation["amenity"="townhall"](area.searchArea);
);
// print results
out body;
>;
out skel qt;
`
const OverpassInstance = 'https://overpass-api.de/api/interpreter'

app.get('/points/:city', cache('1 day'), (req, res) => {
	const { city } = req.params
	const myRequest = `${OverpassInstance}?data=${request(
		decodeURIComponent(city)
	)}`
	fetch(encodeURI(myRequest))
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
			({ points, segments, score }) => ({
				points,
				segments,
				score,
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
const computeAndCacheCity = async (dimension, ville, returnScope, res) => {
	console.log('ville pas encore connue : ', ville)
	fetchExceptions().then((exceptions) =>
		(dimension === 'walking' ? compute(ville) : computeCycling(ville))
			.then(({ geoAPI, ...data }) => {
				scopes[dimension].map(async ([scope, selector]) => {
					const string = JSON.stringify(selector(data, geoAPI))

					try {
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

	villes.map((ville, i) =>
		// settimeout needed, the overpass API instances can raise a "too many requests" error
		setTimeout(() => readFile('walking', ville, 'complete', null), i * 10000)
	)
})
