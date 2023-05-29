const url =
	process.env.NODE_ENV === 'production'
		? `https://villes-pr113.osc-fr1.scalingo.io`
		: `http://localhost:3000/`

export default url
