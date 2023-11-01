export const currentMonthDateTime = () =>
	new Date()
		.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric' })
		.split('/')
		.reverse()
		.join('-')

export default function RésuméChiffré({
	data: { score, points, ridesLength, segments },
	name,
}) {
	if (!segments || !score) return null

	const segmentCount = segments.reduce(
		(memo, next) => memo + (next.properties.rides || [1]).length,
		0
	)
	const options = { year: 'numeric', month: 'long' }

	const date = new Date().toLocaleDateString('fr-FR', options)
	const dateTime = currentMonthDateTime()
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
						En <time dateTime={dateTime}>{date}</time>,{' '}
						<strong
							title={`Précisément, ${score}`}
							css={`
								background: yellow;
							`}
						>
							{Math.round(score)}%
						</strong>{' '}
						des trajets du territoire de {name} sont sécurisés, pour{' '}
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
