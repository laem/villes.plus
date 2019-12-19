import express from 'express'

import faunadb from 'faunadb'
import { compute } from './allez'
const cors = require('cors')

var fs = require('fs'),
	path = require('path')

const app = express()
app.use(cors())

app.get('/ville/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`Function Ville: ${id}`)
	let fileName = path.join(__dirname + '/cache/', id + '.json')
	fs.readFile(fileName, { encoding: 'utf-8' }, function(err, data) {
		if (!err) {
			console.log('les données sont déjà là ! ')

			res.json(JSON.parse(data))
		} else {
			console.log('ville pas encore connue : ', id)
			compute(id).then(data => {
				fs.writeFile(fileName, JSON.stringify(data), function(err) {
					if (err) {
						console.log(err) || res.status(400).end()
					}
					console.log("C'est bon on a géré le cas " + id)
					res.json(data)
				})
			})
		}
	})
})

app.listen(3000, function() {
	console.log('Allez là ! Piétonniez les toutes !')
})
