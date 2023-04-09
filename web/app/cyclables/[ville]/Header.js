import Logo from '@/app/Logo'
import Link from 'next/link'

export default ({ ville }) => (
	<header style={{ marginBottom: '1rem' }}>
		<Logo color={'black'} text={ville} cyclable />
		<p style={{ marginBottom: 0 }}>
			Ce territoire est-il cyclable ? Précisons : <em>vraiment</em> cyclable,
			donc des voies cyclables séparées des voitures et piétons, ou des vélorues
			où le vélo est prioritaire.{' '}
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
