import Image from 'next/image'
import Link from 'next/link'
import { processName } from '../../cyclingPointsRequests'
import villesList from '../villesClassées'
import CityNumericResult from './CityNumericResult'
import { Content, ImageWrapper, Li, Title } from './CityResultUI'

export const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

export async function getWikidata(ville) {
	// TODO variabilise for local dev
	const fetchUrl = `https://villes.plus/api/wikidata/${ville}` //TODO rustine
	const response = await fetch(fetchUrl)

	if (!response.ok) {
		// This will activate the closest `error.js` Error Boundary
		//throw new Error('Failed to fetch wiki data for ' + ville)
		return null
	}
	try {
		const json = await response.json()
		return json
	} catch (e) {
		console.log('Erreur wikidata CityResult')
		console.log(fetchUrl)
	}
}

export default async ({
	ville,
	cyclable,
	data: initialData,
	i,
	onClickLinkToRegion,
}) => {
	const wikidata = await getWikidata(
		processName(cyclable ? métropoleToVille[ville] || ville : ville)
	)

	const villeName = processName(ville)

	const imageURL = wikidata?.image
	const medal = i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]

	return (
		<Li key={ville}>
			<Link
				href={
					onClickLinkToRegion
						? `/cyclables/departements/${onClickLinkToRegion}`
						: encodeURI((cyclable ? '/cyclables/' : '/pietonnes/') + ville)
				}
			>
				<Title>
					<span>{medal}&nbsp;</span>
					{villeName}
				</Title>
				<Content>
					{imageURL && (
						<ImageWrapper>
							<Image
								src={imageURL}
								style={{ objectFit: 'cover' }}
								fill={true}
								alt={`Une photo emblématique du territoire mesuré (${ville})`}
							/>
						</ImageWrapper>
					)}

					<CityNumericResult {...{ cyclable, ville, initialData }} />
				</Content>
			</Link>
		</Li>
	)
}
