const branch = process.env.BRANCH || process.env.HEROKU_BRANCH

export default () => {
	return Promise.resolve({})
}

/*
fetch(
	`https://raw.githubusercontent.com/laem/villes.plus/${branch}/exceptions.json`
).then(res => res.json())
*/
