import express from 'express'

import { compute } from './geoStudio.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import compression from 'compression'
import villes from './villesClassées'
import fetchExceptions from './fetchExceptions'
import apicache from 'apicache'

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

   	
 
);
// print results
out body;
>;
out skel qt;
`
const OverpassInstance = 'https://overpass-api.de/api/interpreter'

app.get('/points/:city', cache('1 day'), (req, res) => {
	const { city } = req.params
	const myRequest = `${OverpassInstance}?data=${request(city)}`
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

const scopes = [
	[
		'meta', // get data only for the front page, lightweight request
		(
			{ pedestrianArea, relativeArea, meanStreetWidth, streetsWithWidthCount },
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
]

const readFile = (ville, scope, res) => {
	let fileName = path.join(cacheDir, ville)
	fs.readFile(
		`${fileName}.${scope}.json`,
		{ encoding: 'utf-8' },
		function (err, json) {
			if (json === 'unknown city') return resUnknownCity(res, ville)
			if (!err) {
				console.log('les meta sont déjà là pour ' + ville)

				let data = JSON.parse(json)
				res && res.json(data)
			} else {
				computeAndCacheCity(ville, scope, res)
			}
		}
	)
}
const computeAndCacheCity = (ville, returnScope, res) => {
	let fileName = path.join(cacheDir, ville)
	console.log('ville pas encore connue : ', ville)
	fetchExceptions().then((exceptions) =>
		compute(ville, exceptions)
			.then(({ geoAPI, ...data }) => {
				scopes.map(([scope, selector]) => {
					const string = JSON.stringify(selector(data, geoAPI))
					fs.writeFile(`${fileName}.${scope}.json`, string, function (err) {
						if (err) {
							console.log(err) || (res && res.status(400).end())
						}
						console.log('Fichier écrit :', ville, scope)

						if (returnScope === scope) res && res.json(JSON.parse(string))
					})
				})
			})
			.catch(
				(e) =>
					console.log(e) ||
					fs.writeFile(fileName, 'unknown city', (err) =>
						resUnknownCity(res, ville)
					)
			)
	)
}

let resUnknownCity = (res, ville) =>
	res &&
	res.status(404).send('Ville inconnue <br/> Unknown city').end() &&
	console.log('Unknown city : ' + ville)

app.get('/api/:scope/:ville', function (req, res) {
	const { ville, scope } = req.params
	console.log('api: ', ville, scope)
	readFile(ville, scope, res)
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
		setTimeout(() => readFile(ville, 'complete', null), i * 10000)
	)
})
