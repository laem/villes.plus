/* code from functions/todos-read.js */
import faunadb from 'faunadb'
import { compute } from '../allez'

const q = faunadb.query
const client = new faunadb.Client({
	secret: process.env.FAUNADB_SERVER_SECRET
})

exports.handler = (event, context) => {
	const id = event.path.split('/ville/')[1]
	console.log(`Function Ville: ${id}`)
	return client
		.query(q.Get(q.Match(q.Index('id'), id)))
		.then(response => {
			console.log('success', response)
			return {
				statusCode: 200,
				body: JSON.stringify(response)
			}
		})
		.catch(error => {
			console.log('ville pas encore connue : ', id)

			return compute(id).then(data =>
				//console.log(JSON.stringify(data)) ||
				client
					.query(
						q.Create(q.Collection('pietonnes'), {
							data: { id, data: data.geojson }
						})
					)
					.then(response => ({
						statusCode: 200,
						body: 'super'
					}))
					.catch(
						error =>
							console.log(error) || {
								statusCode: 400,
								body: JSON.stringify(error)
							}
					)
			)
		})
}
