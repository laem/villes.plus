const algorithmVersion = 'v3'

export default algorithmVersion

//TODO this is temporarily hard coded to 06-2023, since the summer computations didn't run
export const previousDate = '06-2023'

export const getDirectory = (overrideDate) => {
	const date = new Date()
		.toLocaleString('fr-FR', { month: 'numeric', year: 'numeric' })
		.replace('/', '-')
	const path = `${overrideDate || date}/${algorithmVersion}`
	return path
}
