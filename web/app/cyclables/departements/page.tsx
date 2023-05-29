import { Classement } from '@/app/Classement'
import { Metadata } from 'next'
import list from '@/départements.yaml'
import APIUrl from '@/app/APIUrl'

export const metadata: Metadata = {
	title: 'Le classement des départements les plus cyclables - villes.plus',

	description:
		'Chaque département est testé pour déterminer le pourcentage de km cyclables, strictement sécurisés.',
	openGraph: {
		images: 'https://villes-plus.vercel.app/departements.png',
	},
	twitter: {
		card: 'summary_large_image',
	},
}
Promise.delay = function (t, val) {
	return new Promise((resolve) => {
		setTimeout(resolve.bind(null, val), t)
	})
}

Promise.raceAll = function (promises, timeoutTime, timeoutVal) {
	return Promise.all(
		promises.map((p) => {
			return Promise.race([p, Promise.delay(timeoutTime, timeoutVal)])
		})
	)
}

async function getData() {
	const sobreList = list
		.slice(0, 94) // not ready yet for worldwide tiles, we need to set up brouter, downloading all the tiles is huge
		.map(({ nom }) => nom)

	const response = await Promise.raceAll(
		sobreList.map((territory) => {
			const url = APIUrl + `api/cycling/meta/${territory}`
			return fetch(
				url,
				{ cache: 'no-store' } // I don't get why next caches a wrong version
			).then((r) => r.json().then((data) => ({ ...data, status: r.status })))
		}),
		6000,
		false
	)
	console.log(response)

	return response.reduce(
		(memo, data, i) => (!data ? memo : { ...memo, [sobreList[i]]: data }),
		{}
	)
}

export default async function Page() {
	const data = await getData()
	console.log(data)
	return (
		<Classement
			cyclable
			data={data}
			text={'Quelles départements français sont les plus cyclables ?'}
		/>
	)
}
