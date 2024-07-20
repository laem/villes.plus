import Link from 'next/link'
import { Cards, LandingWrapper, Header, Card, LinkCard, Icons } from './UI'
import type { Metadata } from 'next'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import Carte from './cartes/Carte'
import bikeIcon from '@/public/bike.svg'
import CartesBanner from './CartesBanner'

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
		<CartesBanner />
		<Cards>
			<LinkCard>
				<Link href="/cyclables/regions">
					<Carte level="régions" />
					<div>
						Les <strong>régions</strong> les plus cyclables.
					</div>
				</Link>
			</LinkCard>
			<LinkCard>
				<Link href="/cyclables/departements">
					<Carte level="départements" />
					<div>
						Les <strong>départements</strong> les plus cyclables.
					</div>
				</Link>
			</LinkCard>
		</Cards>
		<Cards>
			<LinkCard>
				<Link href="/cyclables/metropoles">
					<Icons>
						<Image src="/metropoles.icon.svg" width="100" height="100" />
						<Image src={bikeIcon} width="100" height="100" />
					</Icons>
					<div>
						Les <strong>métropoles</strong> les plus cyclables.
					</div>
				</Link>
			</LinkCard>
			<LinkCard>
				<Link href="/cyclables/grandes-villes">
					<Icons>
						<Image src="/grandes-villes.icon.svg" width="100" height="100" />
						<Image src={bikeIcon} width="100" height="100" />
					</Icons>
					<div>
						Les <strong>grandes villes</strong> les plus cyclables.
					</div>
				</Link>
			</LinkCard>
			<LinkCard>
				<Link href="/cyclables/prefectures">
					<Icons>
						<Image src="/townhall.simple.svg" width="100" height="100" />
						<Image src={bikeIcon} width="100" height="100" />
					</Icons>
					<div>
						Les <strong>préfectures</strong> les plus cyclables.
					</div>
				</Link>
			</LinkCard>
			<LinkCard>
				<Link href="/cyclables/communes">
					<Icons>
						<Image src="/villes-moyennes.icon.svg" width="100" height="100" />
						<Image src={bikeIcon} width="100" height="100" />
					</Icons>
					<div>
						Les <strong>villes moyennes</strong> les plus cyclables.
					</div>
				</Link>
			</LinkCard>
		</Cards>
		<Cards>
			<LinkCard>
				<Link href="/pietonnes">
					<Icons>
						<Image src="/walking.svg" width="100" height="100" />
					</Icons>
					<div>
						Les grandes villes <strong>les plus piétonnes</strong>.
					</div>
				</Link>
			</LinkCard>
		</Cards>
	</LandingWrapper>
)
