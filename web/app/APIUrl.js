const url =
	process.env.VERCEL_ENV === 'development'
		? `http://localhost:3000/`
		: `https://api.villes.plus/`

export default url
