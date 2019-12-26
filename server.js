import express from 'express'

import faunadb from 'faunadb'
import { compute } from './allez.js'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())

let getScore = data => ({ area: data.realArea })
let getVille = (id, scoreOnly = true, res) => {
	let fileName = path.join(__dirname + '/cache/', id + '.json')
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

app.get('/ville/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`Function Ville: ${id}`)
	getVille(id, false, res)
})
app.get('/score/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`Function Score: ${id}`)
	getVille(id, true, res)
})

app.listen(3000, function() {
	console.log('Allez là ! Piétonniez les toutes les villles  !')
})
