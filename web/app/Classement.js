import ScoreLegend from '@/ScoreLegend'
import Link from 'next/link'
import algorithmVersion from '../../algorithmVersion'
import CityResult from './CityResult'
import {
	ClassementWrapper,
	CounterLevel,
	NewCityLink,
	DateBlock,
	Loading,
	Ol,
} from './ClassementUI'
import { currentMonthDateTime } from './cyclables/[ville]/RésuméChiffré'
import Logo from './Logo'

// TODO this component should probably not be common for both cyclable & pietonnes, but rather juste share UI components and socket hooks

export const normalizedScores = (data) => {
	const million = 1000 * 1000
	const pedestrianArea = data.pedestrianArea / million,
		relativeArea = data.relativeArea / million,
		area = data.geoAPI.surface / 100, // looks to be defined in the 'hectares' unit
		percentage = (pedestrianArea / relativeArea) * 100
	return { pedestrianArea, area, relativeArea, percentage }
}

export function Classement({
	cyclable,
	data,
	text,
	subText,
	level,
	onClickLinkToRegion,
	région,
}) {
	const villes = data

	let villesEntries = Object.entries(villes)

	const counterLevel =
		level &&
		(level === 'metropoles'
			? 'grandes-villes'
			: level === 'grandes-villes'
			? 'metropoles'
			: false)

	return (
		<div>
			<Logo animate cyclable={cyclable} />
			<ClassementWrapper>
				<h2>{text}</h2>
				{subText && (
					<p
						style={css`
							text-align: center;
						`}
					>
						<small>{subText}</small>
					</p>
				)}
				{level === 'prefectures' && (
					<small>
						Les plus grandes préfectures sont à retrouver dans le{' '}
						<Link href="/cyclables/grandes-villes">
							classement des grandes communes
						</Link>
					</small>
				)}
				{counterLevel && cyclable && (
					<CounterLevel>
						<Link href={`/cyclables/${counterLevel}`}>
							<img src={`/${counterLevel}.svg`} />{' '}
							<div>Voir le classement des {counterLevel}</div>
						</Link>
					</CounterLevel>
				)}
				<div id="shareImage">
					<DateBlock>
						🗓️{' '}
						<time dateTime={currentMonthDateTime()}>
							{new Date().toLocaleString('fr-FR', {
								month: 'long',
								year: 'numeric',
							})}
						</time>{' '}
						{cyclable ? (
							<Link href="/explications/cyclables">
								algo {algorithmVersion}
							</Link>
						) : (
							<Link href="/explications/pietonnes">algo v1</Link>
						)}
					</DateBlock>
					{villesEntries.length === 0 && (
						<Loading>Chargement en cours ⏳</Loading>
					)}

					{cyclable && <ScoreLegend scores={villesEntries} />}

					{onClickLinkToRegion && (
						<p style={{ textAlign: 'center' }}>
							Le score d'une région est simplement la moyenne de ses
							départements.
						</p>
					)}
					{région === 'Bourgogne-Franche-Comté' && (
						<details style={{ margin: '.6rem auto', maxWidth: '700px' }}>
							<summary>
								Nous avons exclu le Territoire-de-Belfort du score de la région
								Bourgogne-Franche-Compté.
							</summary>
							Le département du Territoire-de-Belfort est une exception
							historique à la fois par sa taille et par sa superficie. Nous
							l'avons donc exclu du calcul de la moyenne de la région
							Bourgogne-Franche-Comté, désolé ! Ses 140 000 habitants sur les ~4
							millions de la région ne font pas le poids pour influencer
							significativement le score régional.
						</details>
					)}

					{
						<Ol>
							{villesEntries
								.map(([ville, data]) => {
									if (cyclable) return [ville, data]
									if (!data || !data.geoAPI)
										return [
											ville,
											{ percentage: -Infinity, status: data.status },
										]
									return [ville, { ...data, ...normalizedScores(data) }]
								})
								.sort(([, v1], [, v2]) =>
									cyclable
										? v2?.score - v1?.score
										: v2?.percentage - v1?.percentage
								)
								.map(([ville, data], i) => {
									return (
										<CityResult
											onClickLinkToRegion={onClickLinkToRegion ? ville : false}
											key={ville}
											{...{ ville, cyclable, data, i }}
										/>
									)
								})}
						</Ol>
					}
				</div>
			</ClassementWrapper>
			<NewCityLink />
		</div>
	)
}
