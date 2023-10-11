import { Classement } from '@/app/Classement'
import { Metadata } from 'next'
import list from '@/départements.yaml'
import APIUrl from '@/app/APIUrl'
import { getDirectory } from '@/../algorithmVersion'

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
		//.slice(0, 96) // not ready yet for worldwide tiles, we need to set up brouter, downloading all the tiles is huge
		// Only La Réunion is removed, we've got a problem with a small french town named La Réunion...
		.map(({ nom }) => nom)

	const response = await Promise.raceAll(
		sobreList.map((territory) => {
			const url = APIUrl + `api/cycling/meta/${territory}/${getDirectory()}`
			return fetch(url).then((r) =>
				r.json().then((data) => ({ ...data, status: r.status }))
			)
		}),
		6000,
		false
	)

	const obj = response.reduce(
		(memo, data, i) => (!data ? memo : { ...memo, [sobreList[i]]: data }),
		{}
	)
	console.log(obj)
	return obj
}

export default async function Page({ searchParams }) {
	const data = await getData()
	return (
		<Classement
			cyclable
			data={data}
			text={'Quelles départements français sont les plus cyclables ?'}
			gridView={searchParams.gridView}
		/>
	)
}
