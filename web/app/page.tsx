import Link from 'next/link'
import { Cards, LandingWrapper, Header } from './UI'
import type { Metadata } from 'next'
import Image from 'next/image'
import logo from '@/public/logo.svg'

export const metadata: Metadata = {
	title:
		'Le classement des villes les plus cyclables et piétonnes - villes.plus',
	description: `Une ville ne peut être agréable si elle est hostile aux piétons et aux vélos (ainsi qu'à toutes les mobilités légères). Nous évaluons, avec une méthodologie complètement transparente, une note de cyclabilité et de surface piétonne pour chaque ville et métropole française.`,
}

export default () => (
	<LandingWrapper>
		<Header>
			<Image src={logo} alt="Logo de villes.plus" />
			<h1>Villes.plus</h1>
		</Header>
		<Cards>
			<Link href="/cyclables/metropoles">
				<span>🚲️</span> Le classement des <strong>métropoles</strong> les plus
				cyclables.
			</Link>
			<Link href="/cyclables/grandes-villes">
				<span>🚲️</span> Le classement des <strong>grandes villes</strong> les
				plus cyclables.
			</Link>
			<Link href="/cyclables/communes">
				<span>🚲️</span> Le classement des <strong>villes moyennes</strong> les
				plus cyclables.
			</Link>
			<Link href="/cyclables/prefectures">
				<span>🚲️</span> Le classement des <strong>préfectures</strong> les plus
				cyclables.
			</Link>
			<Link href="/cyclables/departements">
				<span>🚲️</span> Le classement des <strong>départements</strong> les
				plus cyclables.
			</Link>
		</Cards>
		<Cards>
			<Link href="/pietonnes">
				<span>🚶</span>
				Le classement des grandes villes <strong>les plus piétonnes</strong>
			</Link>
		</Cards>
	</LandingWrapper>
)
