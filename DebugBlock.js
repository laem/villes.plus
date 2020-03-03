import React from 'react'

export default ({
	ville,
	exceptions,
	toggleException,
	debugData,
	villeExceptions
}) => {
	if (!debugData) return null
	const { properties } = debugData
	const [long, lat] = debugData.geometry.coordinates[0][0]
	return (
		<div
			css={`
				background: white;
				width: 80%;
				margin: 0 auto;
				a {
					margin: 0.3rem;
				}
			`}
		>
			{properties ? (
				<>
					{' '}
					<blockquote>{JSON.stringify(properties, null, 2)}</blockquote>
					<a
						href={`http://maps.google.com/maps?q=&layer=c&cbll=${lat},${long}`}
						target="_blank"
					>
						Vue Google StreetView
					</a>
					<a
						href={`https://www.openstreetmap.org/${properties.id}`}
						target="_blank"
					>
						Page OSM
					</a>
					<button onClick={() => toggleException(ville, properties.id)}>
						{villeExceptions.includes(properties.id)
							? 'Re-sélectionner'
							: 'Mettre sur le banc'}
					</button>
					<button
						onClick={() =>
							navigator.clipboard.writeText(JSON.stringify(exceptions, null, 2))
						}
					>
						Copier les exceptions
					</button>
				</>
			) : (
				"Cliquez sur une forme pour l'inspecter"
			)}
		</div>
	)
}
