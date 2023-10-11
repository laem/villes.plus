import { Classement } from '@/app/Classement'
import APIUrl from '@/app/APIUrl'
import prefectures from '@/préfectures'
import type { Metadata } from 'next'
import { getDirectory } from '@/../algorithmVersion'

export const metadata: Metadata = {
	title: 'Le classement des préfectures les plus cyclables - villes.plus',

	description:
		'Chaque préfecture est testée pour déterminer le pourcentage de km cyclables strictement sécurisés. Les grandes préfectures sont à retrouver dans le classement des grandes villes cyclables',
	openGraph: {
		images: 'https://villes.plus/cyclables.png',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

const villesList = prefectures
	.filter((element) => +element.population.replace(/\s/g, '') < +100000) // large prefectures are already in the large cities ranking
	.map((element) => {
		const name = element.nom
		return name + '.' + 8 // level 8 is a commune in France
	})
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
export default async function Page() {
	const data = await getData()
	return <Classement cyclable data={data} level="prefectures" />
}
