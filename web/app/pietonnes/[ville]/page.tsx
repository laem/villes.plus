import getCityData from '@/app/wikidata'
import { Metadata } from 'next'
import { Suspense } from 'react'
import Ville from './Ville'

export async function generateMetadata({ params }): Promise<Metadata> {
	const ville = decodeURIComponent(params.ville)

	console.log('ville', ville)
	const response = await getCityData(ville)

	const image = response.image,
		images = [image]
	return {
		title: `${ville} - Carte cyclable - villes.plus`,
		description: `À quel point ${ville} est-elle cyclable ?`,
		openGraph: { images },
	}
}

export default ({ params, searchParams }) => {
	const { ville: villeRaw } = params,
		ville = decodeURIComponent(villeRaw)
	return (
		<Suspense fallback={<Fallback />}>
			<Ville {...{ ville, debug: searchParams.debug }} />
		</Suspense>
	)
}

const Fallback = () => <div>Chargement de la carte dynamique</div>
