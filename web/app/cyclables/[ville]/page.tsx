import { Metadata } from 'next'
import Header from './Header'
import { Wrapper } from './UI'
import Ville from './Ville'
import getCityData, { toThumb } from '@/app/wikidata'

import villesList from '@/villesClassées'

const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

export async function generateMetadata({ params }): Promise<Metadata> {
	const ville = decodeURIComponent(params.ville)

	const response = await getCityData(métropoleToVille[ville] || ville)
	console.log('W', ville, response)
	const wikidata = response?.results?.bindings[0]

	const image = wikidata?.pic.value && toThumb(wikidata.pic.value),
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
			<Ville {...{ osmId, ville }} />
		</Wrapper>
	)
}
