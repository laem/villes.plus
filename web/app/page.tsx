import Link from 'next/link'
import { Cards, LandingWrapper } from './UI'

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
