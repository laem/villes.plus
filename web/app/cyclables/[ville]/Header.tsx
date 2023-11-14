import { processName } from '@/../cyclingPointsRequests'
import CityNumericResult from '@/app/CityNumericResult'
import { getWikidata, métropoleToVille } from '@/app/CityResult'
import { ImageAndScoreWrapper, SmallImageWrapper } from '@/app/CityResultUI'
import Logo from '@/app/Logo'
import { Header } from './HeaderUI'
import css from '@/css/convertToJs'
import Image from 'next/image'
import Link from 'next/link'
import RésuméChiffré from './RésuméChiffré'

export default async ({ ville, data }) => {
	const wikidata = await getWikidata(
		processName(métropoleToVille[ville] || ville)
	)

	return (
		<Header>
			<details>
				<summary
					style={css`
						list-style-type: none;
					`}
				>
					<Logo
						color={'black'}
						text={processName(ville)}
						cyclable
						align="start"
					/>
					<ImageAndScoreWrapper>
						<SmallImageWrapper>
							<Image
								src={wikidata.image}
								style={{ objectFit: 'cover' }}
								fill={true}
								alt={`Une photo emblématique du territoire mesuré (${ville})`}
							/>
						</SmallImageWrapper>
						<CityNumericResult
							{...{ cyclable: true, ville, initialData: data }}
						/>
					</ImageAndScoreWrapper>
				</summary>

				<div
					style={css`
						background: white;
						padding: 1rem;
					`}
				>
					<p style={{ marginBottom: 0 }}>
						Voici le score et l'analyse de cyclabilité de {processName(ville)}.
					</p>
					<p>
						Chaque mois, nous faisons rouler des 🚴 cyclistes virtuels sur une
						multitude d'itinéraires, et nous comptons la proportion des
						kilomètres{' '}
						<details style={{ display: 'inline' }}>
							<summary
								style={{
									cursor: 'help',
									listStyleType: 'none',
									display: 'inline',
								}}
							>
								<strong
									style={css`
										border-bottom: 2px solid #8f68ea;
									`}
								>
									vraiment sécurisés
								</strong>
								.
							</summary>
							<div style={{ borderLeft: '3px solid #8f68ea' }}>
								<p>
									Nous considérons comme sécurisées les voies cyclables séparées
									des voitures et piétons ou des vélorues où le vélo est
									prioritaire. Les pistes cyclables peintes au sol qui longent
									des voitures garées ne sont pas sécurisées.
								</p>
								<p>
									Les voies de bus où les cyclistes doivent cohabiter avec des
									véhicules de 10 tonnes non plus. Les chemins piétons de balade
									non plus.
								</p>
							</div>
						</details>
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
				</div>
			</details>
		</Header>
	)
}
