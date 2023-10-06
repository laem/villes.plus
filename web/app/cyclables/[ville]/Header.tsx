import { processName } from '@/../cyclingPointsRequests'
import CityNumericResult from '@/app/CityNumericResult'
import { getWikidata } from '@/app/CityResult'
import {
	ImageAndScoreWrapper,
	SmallImageWrapper,
	TitleImageWrapper,
} from '@/app/CityResultUI'
import Logo from '@/app/Logo'
import Image from 'next/image'
import Link from 'next/link'

export default async ({ ville, data }) => {
	const wikidata = await getWikidata(processName(ville))

	return (
		<header style={{ marginBottom: '1rem' }}>
			<Logo color={'black'} text={processName(ville)} cyclable />
			<ImageAndScoreWrapper>
				<SmallImageWrapper>
					<Image
						src={wikidata.image}
						style={{ objectFit: 'cover' }}
						fill={true}
						alt={`Une photo emblématique du territoire mesuré (${ville})`}
					/>
				</SmallImageWrapper>
				<CityNumericResult {...{ cyclable: true, ville, initialData: data }} />
			</ImageAndScoreWrapper>

			<p style={{ marginBottom: 0 }}>
				Ce territoire est-il cyclable ? Précisons : <em>vraiment</em> cyclable,
				donc des voies cyclables séparées des voitures et piétons, ou des
				vélorues où le vélo est prioritaire.{' '}
			</p>
			<div
				style={{
					textAlign: 'right',
				}}
			>
				<small>
					<Link href="/explications/cyclables">En savoir plus</Link> sur la
					méthode d'évaluation.
				</small>
			</div>
		</header>
	)
}
