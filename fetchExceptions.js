const fetchFunction =
	typeof fetch !== 'undefined' ? fetch : require('node-fetch')

const branch = process.env.BRANCH || process.env.HEROKU_BRANCH
console.log('branche', branch)

export default () =>
	fetchFunction(
		`https://raw.githubusercontent.com/laem/villes.plus/${branch}/exceptions.json`
	).then(res => res.json())
