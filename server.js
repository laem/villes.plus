import express from 'express'
import fetch from 'node-fetch'

import { compute } from './allez.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import compression from 'compression'

const cacheDir = __dirname + '/cache'

if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir)
}

const app = express()
app.use(cors())
app.use(compression())

app.use(express.static(__dirname))

let getVille = (id, scoreOnly = true, res) => {
	let fileName = path.join(cacheDir, id)
	if (scoreOnly) {
		fs.readFile(fileName + '.meta.json', { encoding: 'utf-8' }, function(
			err,
			json
		) {
			if (json === 'unknown city') return resUnknownCity(res, id)
			if (!err) {
				console.log('les meta sont déjà là pour ' + id)

				let data = JSON.parse(json)
				res.json(data)
			} else {
				computeAndCacheCity(id, fileName, res, scoreOnly)
			}
		})
	} else {
		fs.readFile(fileName + '.json', { encoding: 'utf-8' }, function(err, json) {
			if (json === 'unknown city') return resUnknownCity(res, id)
			if (!err) {
				console.log('les données sont déjà là pour ' + id)

				let data = JSON.parse(json)
				res.json(data)
			} else {
				computeAndCacheCity(id, fileName, res, scoreOnly)
			}
		})
	}
}

const computeAndCacheCity = (id, fileName, res, scoreOnly) => {
	console.log('ville pas encore connue : ', id)
	Promise.all([
		compute(id),
		fetch(
			`https://geo.api.gouv.fr/communes?nom=${id}&fields=surface,departement,centre&format=json&geometry=centre&boost=population`
		).then(res => res.json())
	])
		.then(([data, [geoData]]) => {
			fs.writeFile(
				fileName + '.json',
				JSON.stringify({ ...data, geoData }),
				function(err) {
					if (err) {
						console.log(err) || res.status(400).end()
					}
					console.log("C'est bon on a géré le cas " + id)

					const meta = { pedestrianArea: data.realArea, geoData }

					fs.writeFile(fileName + '.meta.json', JSON.stringify(meta), function(
						err
					) {
						if (err) {
							console.log(err) || res.status(400).end()
						}
						res.json(scoreOnly ? meta : data)
					})
				}
			)
		})
		.catch(e =>
			fs.writeFile(fileName, 'unknown city', err => resUnknownCity(res, id))
		)
}

let resUnknownCity = (res, id) =>
	res
		.status(404)
		.send(`Ville inconnue <br/> Unknown city`)
		.end() && console.log('Unknown city : ' + id)

app.get('/api/ville/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`/api/ville: ${id}`)
	getVille(id, false, res)
})
app.get('/api/score/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`/api/score: ${id}`)
	getVille(id, true, res)
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})

let port = process.env.PORT || 3000
app.listen(port, function() {
	console.log(
		'Allez là ! Piétonniez les toutes les villles  ! Sur le port ' + port
	)
})
