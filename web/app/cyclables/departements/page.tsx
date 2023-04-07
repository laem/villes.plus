import { Classement } from '@/app/Classement'
import { Metadata } from 'next'
import list from '@/départements.yaml'
import APIUrl from '@/app/APIUrl'

console.log(list)
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
async function getData() {
	const sobreList = list.slice(0, 5).map(({ nom }) => nom)

	const response = await Promise.all(
		sobreList.map((territory) => {
			const url = APIUrl + `api/cycling/meta/${territory}`
			return fetch(
				url,
				{ cache: 'no-store' } // I don't get why next caches a wrong version
			).then((yo) => yo.json())
		})
	)

	return response.reduce(
		(memo, data, i) => ({ ...memo, [sobreList[i]]: data }),
		{}
	)
}

export default async function Page() {
	const data = await getData()
	return <Classement cyclable data={data} />
}
