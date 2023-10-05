import assos from '@/registre-assos-vélo.yaml'
import Link from 'next/link'
import Image from 'next/image'
import { processName } from '@/../cyclingPointsRequests'
export default ({ ville }) => {
	const asso = assos.find(
		(asso) => asso.ville === processName(ville) || asso.métropole === ville
	)
	if (!asso) return null

	return (
		<p>
			😠 Pas content ? Soutenez{' '}
			<Link href={asso.site}>
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
			.
		</p>
	)
}
