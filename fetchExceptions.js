const fetchFunction =
	typeof fetch !== 'undefined' ? fetch : require('node-fetch')

export default () =>
	fetchFunction(
		'https://raw.githubusercontent.com/laem/villes.plus/master/exceptions.json'
	).then(res => res.json())
