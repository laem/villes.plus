import express from 'express'

import faunadb from 'faunadb'
import { compute } from './allez'
const app = express()
const q = faunadb.query
const client = new faunadb.Client({
	secret: process.env.FAUNADB_SERVER_SECRET,
	timeout: 100
})

app.get('/ville/:ville', function(req, res) {
	const id = req.params.ville
	console.log(`Function Ville: ${id}`)
	return client
		.query(q.Get(q.Match(q.Index('id'), id)))
		.then(response => {
			console.log('success', response)
			res.json(response)
		})
		.catch(error => {
			console.log('ville pas encore connue : ', id)

			return compute(id).then(
				data =>
					console.log(JSON.stringify(data).length) ||
					client
						.query(
							q.Create(q.Collection('pietonnes'), {
								data: { id, yiyi: data.geojson }
							})
						)
						.then(response => res.json(response))
						.catch(error => console.log(error) || res.status(400).end())
			)
		})
})

app.listen(3000, function() {
	console.log('Allez là ! Piétonniez les toutes !')
})
