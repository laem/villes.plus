export default url =>
	(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000') +
	'/api/' +
	url
