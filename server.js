import express from 'express'

import faunadb from 'faunadb'
import { compute } from './allez.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const cacheDir = __dirname + '/cache'

if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir)
}

const app = express()
app.use(cors())

app.use(express.static(__dirname))

let getScore = data => ({ area: data.realArea })
let getVille = (id, scoreOnly = true, res) => {
	let fileName = path.join(cacheDir, id + '.json')
	fs.readFile(fileName, { encoding: 'utf-8' }, function(err, json) {
		if (!err) {
			console.log('les données sont déjà là pour ' + id)

			let data = JSON.parse(json)
			res.json(scoreOnly ? getScore(data) : data)
		} else {
			console.log('ville pas encore connue : ', id)
			compute(id).then(data => {
				fs.writeFile(fileName, JSON.stringify(data), function(err) {
					if (err) {
						console.log(err) || res.status(400).end()
					}
					console.log("C'est bon on a géré le cas " + id)
					res.json(scoreOnly ? getScore(data) : data)
				})
			})
		}
	})
}

app.get('/api/ville/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`Function Ville: ${id}`)
	getVille(id, false, res)
})
app.get('/api/score/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`Function Score: ${id}`)
	getVille(id, true, res)
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(process.env.PORT || 3000, function() {
	console.log('Allez là ! Piétonniez les toutes les villles  !')
})
