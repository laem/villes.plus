import express from 'express'
import fetch from 'node-fetch'

import { compute } from './geoStudio.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import compression from 'compression'
import villes from './villesClassées'
import fetchExceptions from './fetchExceptions'

const cacheDir = __dirname + '/cache'

if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir)
}

const app = express()
app.use(cors())
app.use(compression())

app.use(express.static(__dirname))

const scopes = [
	[
		'meta', // get data only for the front page, lightweight request
		(data, geoAPI) => ({ pedestrianArea: data.realArea, geoAPI })
	],
	[
		'merged', //all the above, plus data to visualise the merged polygon from which the area is computed
		(data, geoAPI) => ({
			mergedPolygons: data.mergedPolygons,
			geoAPI
		})
	],
	[
		'complete', // all the above, plus all the polygons, to debug the request result and exclude shapes on the website
		(data, geoAPI) => ({ polygons: data.polygons, geoAPI })
	]
]

const readFile = (ville, scope, res) => {
	let fileName = path.join(cacheDir, ville)
	fs.readFile(`${fileName}.${scope}.json`, { encoding: 'utf-8' }, function(
		err,
		json
	) {
		if (json === 'unknown city') return resUnknownCity(res, ville)
		if (!err) {
			console.log('les meta sont déjà là pour ' + ville)

			let data = JSON.parse(json)
			res && res.json(data)
		} else {
			computeAndCacheCity(ville, scope, res)
		}
	})
}
const computeAndCacheCity = (ville, returnScope, res) => {
	let fileName = path.join(cacheDir, ville)
	console.log('ville pas encore connue : ', ville)
	fetchExceptions().then(
		exceptions =>
			console.log('excep', exceptions) ||
			compute(ville, exceptions)
				.then(({ geoAPI, ...data }) => {
					scopes.map(([scope, selector]) => {
						const string = JSON.stringify(selector(data, geoAPI))
						fs.writeFile(`${fileName}.${scope}.json`, string, function(err) {
							if (err) {
								console.log(err) || (res && res.status(400).end())
							}
							console.log('Fichier écrit :', ville, scope)

							if (returnScope === scope) res && res.json(string)
						})
					})
				})
				.catch(
					e =>
						console.log(e) ||
						fs.writeFile(fileName, 'unknown city', err =>
							resUnknownCity(res, ville)
						)
				)
	)
}

let resUnknownCity = (res, ville) =>
	res &&
	res
		.status(404)
		.send('Ville inconnue <br/> Unknown city')
		.end() &&
	console.log('Unknown city : ' + ville)

app.get('/api/:scope/:ville', function(req, res) {
	const { ville, scope } = req.params
	console.log('api: ', ville, scope)
	readFile(ville, scope, res)
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})

let port = process.env.PORT || 3000
app.listen(port, function() {
	console.log(
		'Allez là ! Piétonniez les toutes les villles  ! Sur le port ' + port
	)
	villes.map(ville => computeAndCacheCity(ville, null))
})
