import { Classement } from '../Classement'
import APIUrl from '@/app/APIUrl'
import villesListRaw from '@/villesClassées'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Le classement des villes les plus cyclables - villes.plus',

	description:
		'Chaque ville est testée pour déterminer le pourcentage de km cyclables, strictement sécurisés.',
	openGraph: {
		images: 'https://villes-plus.vercel.app/cyclables.png',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

const cyclable = true
const villesList = villesListRaw
	.map((element) =>
		typeof element === 'string'
			? cyclable
				? null
				: element
			: cyclable
			? element[1]
			: element[0]
	)
	.filter(Boolean)

async function getData() {
	const response = await Promise.all(
		villesList.map((ville) => {
			const url =
				APIUrl + `api/${cyclable ? 'cycling' : 'walking'}/meta/${ville}`
			return fetch(
				url,
				{ cache: 'no-store' } // I don't get why next caches a wrong version
			).then((yo) => yo.json())
		})
	)

	return response.reduce(
		(memo, data, i) => ({ ...memo, [villesList[i]]: data }),
		{}
	)
}
export default async function Page() {
	const data = await getData()
	return <Classement cyclable data={data} />
}
