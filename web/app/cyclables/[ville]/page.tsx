import { Metadata } from 'next'
import Header from './Header'
import { Wrapper } from './UI'
import Ville from './Ville'

import villesList from '@/villesClassées'
import { Suspense } from 'react'
import wikidata from '@/app/wikidata'

const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

export async function generateMetadata({ params }): Promise<Metadata> {
	const ville = decodeURIComponent(params.ville)

	try {
		const response = await wikidata(métropoleToVille[ville] || ville)

		const image = response.image,
			images = [image].filter(Boolean)

		return {
			title: `${ville} - Carte cyclable - villes.plus`,
			description: `À quel point ${ville} est-elle cyclable ?`,
			openGraph: { images },
		}
	} catch (e) {
		console.log('oups', e)
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
