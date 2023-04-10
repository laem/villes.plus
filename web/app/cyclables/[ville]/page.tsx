import { Metadata } from 'next'
import Header from './Header'
import { Wrapper } from './UI'
import Ville from './Ville'
import getCityData, { toThumb } from '@/app/wikidata'

import villesList from '@/villesClassées'
import { Suspense } from 'react'

const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

export async function generateMetadata({ params }): Promise<Metadata> {
	const ville = decodeURIComponent(params.ville)

	const response = await fetch(
		`/api/wikidata/${métropoleToVille[ville] || ville}`
	)
	const json = response.json()

	const image = json.image,
		images = [image]
	return {
		title: `${ville} - Carte cyclable - villes.plus`,
		description: `À quel point ${ville} est-elle cyclable ?`,
		openGraph: { images },
	}
}

export default ({ params, searchParams }) => {
	const { ville: villeRaw } = params,
		ville = decodeURIComponent(villeRaw),
		osmId = searchParams.id
	return (
		<Wrapper>
			<Header ville={ville} />
			<Suspense fallback={<Fallback />}>
				<Ville {...{ osmId, ville }} />
			</Suspense>
		</Wrapper>
	)
}

const Fallback = () => <div>Chargement de la carte dynamique</div>
