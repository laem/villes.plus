import { SmallLegend } from '../UI'

export default function RésuméChiffré({
	data: { score, points, ridesLength, segments },
	name,
}) {
	const segmentCount = segments.reduce(
		(memo, next) => memo + (next.properties.rides || [1]).length,
		0
	)
	const options = { year: 'numeric', month: 'long' }

	const date = new Date().toLocaleDateString('fr-FR', options)
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<div>
				{score != null ? (
					<p>
						En {date},{' '}
						<strong
							title={`Précisément, ${score}`}
							css={`
								background: yellow;
							`}
						>
							{Math.round(score)}%
						</strong>{' '}
						des trajets du territoires de {name} sont sécurisés, pour{' '}
						{points.length} points donnant{' '}
						{(ridesLength || rides.length).toLocaleString('fr-FR')} itinéraires,
						soit au total {segmentCount.toLocaleString('fr-FR')} segments.
					</p>
				) : (
					<p>{points.length} points.</p>
				)}
			</div>
		</div>
	)
}
