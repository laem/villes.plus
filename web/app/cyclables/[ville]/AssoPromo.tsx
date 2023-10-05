import assos from '@/registre-assos-vélo.yaml'
import Link from 'next/link'
import Image from 'next/image'
import { processName } from '@/../cyclingPointsRequests'
export default ({ ville }) => {
	console.log('VILLE', ville)
	const asso = assos.filter(
		(asso) =>
			asso.ville === processName(ville) ||
			asso.métropole === ville ||
			asso.département === ville
	)
	if (!asso.length) return null

	return (
		<p>
			😠 Pas content ? Soutenez{' '}
			{asso.map((asso) => (
				<Link href={asso.site} key={asso.nom}>
					<img
						src={asso.logo}
						style={{
							objectFit: 'cover',
							width: '2rem',
							verticalAlign: 'middle',
							margin: '0 .4rem 0 .2rem',
							height: '2rem',
						}}
						alt={'Le logo de ' + asso.name}
					/>
					{asso.nom}
				</Link>
			))}
			.
		</p>
	)
}
