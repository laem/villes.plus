import dynamic from 'next/dynamic'
import listComputes from './listComputes'
const Client = dynamic(() => import('./Client'), {
	loading: () => 'Chargement...',
	ssr: false,
})

async function getData(territories) {
	const requests = territories.map(({ name, apiUrl }) => {
		console.log('URL', apiUrl)
		return fetch(apiUrl).then((r) =>
			r.json().then((data) => ({ ...data, status: r.status }))
		)
	})
	const responses = await Promise.all(requests)
	console.log('R', responses)
	return responses
}

export default async function Dashboard() {
	const territories = listComputes().slice(0, 100)

	const data = await getData(territories)

	return <Client data={data} territories={territories} />
}
