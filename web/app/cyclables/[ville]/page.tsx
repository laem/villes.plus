import { Metadata } from 'next'
import Header from './Header'
import { Wrapper } from './UI'
import Ville from './Ville'

export async function generateMetadata({ params }): Promise<Metadata> {
	const ville = decodeURIComponent(params.ville)

	return {
		title: `${ville} - Carte cyclable - villes.plus`,
		description: `À quel point ${ville} est-elle cyclable ?`,
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
