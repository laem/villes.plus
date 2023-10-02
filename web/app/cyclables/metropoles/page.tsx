import { Classement } from '../../Classement'
import APIUrl from '@/app/APIUrl'
import villesListRaw from '@/villesClassées'
import type { Metadata } from 'next'
import { getDirectory } from '@/../algorithmVersion'

export const metadata: Metadata = {
	title: 'Le classement des métropoles les plus cyclables - villes.plus',

	description:
		'Chaque métropole est testée pour déterminer le pourcentage de km cyclables strictement sécurisés.',
	openGraph: {
		images: 'https://villes.plus/cyclables.png',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

const villesList = villesListRaw
	.map((element) => (typeof element === 'string' ? null : element[1]))
	.filter(Boolean)

async function getData() {
	const response = await Promise.all(
		villesList.map((ville) => {
			const url = APIUrl + `api/cycling/meta/${ville}/${getDirectory()}`
			return fetch(url).then((r) =>
				r.json().then((data) => ({ ...data, status: r.status }))
			)
		})
	)

	return response.reduce(
		(memo, data, i) => ({ ...memo, [villesList[i]]: data }),
		{}
	)
}
export default async function Page({ searchParams }) {
	const data = await getData()
	return (
		<Classement
			cyclable
			data={data}
			level="metropoles"
			text={'Quelles métropoles françaises sont les plus cyclables ?'}
			gridView={searchParams.gridView}
		/>
	)
}
