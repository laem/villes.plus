import { Classement } from '@/app/Classement'
import APIUrl from '@/app/APIUrl'
import villesListRaw from '@/communes30000'
import type { Metadata } from 'next'
import { getDirectory } from '@/../algorithmVersion'

export const metadata: Metadata = {
	title: 'Le classement des communes moyennes les plus cyclables - villes.plus',

	description:
		'Chaque commune est testée pour déterminer le pourcentage de km cyclables strictement sécurisés.',
	openGraph: {
		images: 'https://villes.plus/cyclables.png',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

const villesList = villesListRaw
	.map((element) => {
		const name = element.nom
		return name + '.' + 8 // level 8 is a commune in France
	})
	.filter(Boolean)

async function getData() {
	const response = await Promise.all(
		villesList.map(async (ville) => {
			const url = APIUrl + `api/cycling/meta/${ville}/${getDirectory()}`
			const res = await fetch(url)

			if (!res.ok) {
				// This will activate the closest `error.js` Error Boundary
				throw new Error('Failed to fetch data for cyclables/communes ' + url)
			}
			const text = await res.text()
			console.log('RES', text)
			try {
				const json = JSON.parse(text)
				return { ...json, status: res.status }
			} catch (e) {
				console.log('yoyo', e)
			}
		})
	)

	return response.reduce(
		(memo, data, i) => ({ ...memo, [villesList[i]]: data }),
		{}
	)
}
export default async function Page() {
	const data = await getData()
	return (
		<Classement
			cyclable
			data={data}
			level="communes"
			text="Quelles communes de + de 30 000 habitants sont les plus cyclables ?"
			subText="Les communes d'Outre-Mer viendront bientôt compléter le classement..."
			gridView={false}
		/>
	)
}
