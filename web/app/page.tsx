import Link from 'next/link'
import { Cards, LandingWrapper } from './UI'
import type { Metadata } from 'next'
import Header from './Header'

export const metadata: Metadata = {
	title:
		'Le classement des villes les plus cyclables et piétonnes - villes.plus',
	description: `Une ville ne peut être agréable si elle est hostile aux piétons et aux vélos (ainsi qu'à toutes les mobilités légères). Nous évaluons, avec une méthodologie complètement transparente, une note de cyclabilité et de surface piétonne pour chaque ville et métropole française.`,
}

export default () => (
	<LandingWrapper>
		<Header />
		<Cards>
			<Link href="/cyclables">
				<span>🚲️</span> Le classement des <strong>métropoles</strong> les plus
				cyclables.
			</Link>
			<Link href="/cyclables/departements">
				<span>🚲️</span> Le classement des <strong>départements</strong> les
				plus cyclables.
			</Link>
			<Link href="/pietonnes">
				<span>🚶</span>
				Le classement des grandes villes <strong>les plus piétonnes</strong>
			</Link>
		</Cards>
	</LandingWrapper>
)
