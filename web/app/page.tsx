import Link from 'next/link'
import { Cards, LandingWrapper } from './UI'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title:
		'Le classement des villes les plus cyclables et piétonnes - villes.plus',
	description: `Une ville ne peut être agréable si elle est hostile aux piétons et aux vélos (ainsi qu'à toutes les mobilités légères). Nous évaluons, avec une méthodologie complètement transparente, une note de cyclabilité et de surface piétonne pour chaque ville et métropole française.`,
}

export default () => (
	<LandingWrapper>
		<h1>Villes.plus</h1>
		<Cards>
			<Link href="/cyclables">
				<span>🚲️</span> Le classement des métropoles{' '}
				<strong>les plus cyclables</strong>
			</Link>
			<Link href="/piétonnes">
				<span>🚶</span>
				Le classement des grandes villes <strong>les plus piétonnes</strong>
			</Link>
		</Cards>
	</LandingWrapper>
)
