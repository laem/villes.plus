import { processName } from '@/../cyclingPointsRequests'
import CityNumericResult from '@/app/CityNumericResult'
import { getWikidata } from '@/app/CityResult'
import { ImageAndScoreWrapper, SmallImageWrapper } from '@/app/CityResultUI'
import Logo from '@/app/Logo'
import Image from 'next/image'
import Link from 'next/link'
import RésuméChiffré from './RésuméChiffré'

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
				Découvrez le score et la carte de l'analyse de cyclabilité de{' '}
				{processName(ville)}.
			</p>
			<p>
				Chaque mois, nous faisons rouler des cyclistes virtuels sur une
				multitude d'itinéraires, et nous comptons la proportion des kilomètres{' '}
				<strong>vraiment sécurisés</strong>, donc des voies cyclables séparées
				des voitures et piétons ou des vélorues où le vélo est prioritaire.
			</p>
			<RésuméChiffré data={data} name={processName(ville)} />
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
