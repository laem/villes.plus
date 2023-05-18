const url =
	process.env.NODE_ENV === 'production'
		? `https://api.villes.plus/`
		: `http://localhost:3000/`

export default url
