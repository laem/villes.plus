import { Classement } from '@/app/Classement'
import APIUrl from '@/app/APIUrl'
import villesListRaw from '@/villesClassées'
import type { Metadata } from 'next'
import { getDirectory } from '@/../algorithmVersion'

const description =
	'Chaque grande commune est testée pour déterminer le pourcentage de km cyclables strictement sécurisés.'
const title =
	'Le classement des grandes communes les plus cyclables - villes.plus'
export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: 'https://villes.plus/cyclables.png',
		title,
		description,
		type: 'article',
		publishedTime: new Date().toISOString(),
	},
	twitter: {
		card: 'summary_large_image',
	},
}

const villesList = villesListRaw
	.map((element) => {
		const name = typeof element === 'string' ? element : element[0]
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
	return (
		<Classement
			cyclable
			data={data}
			level="grandes-villes"
			text={`Quelles grandes villes françaises sont les plus cyclables ?`}
		/>
	)
}
