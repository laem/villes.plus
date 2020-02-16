import React from 'react'

export default ({
	ville,
	exceptions,
	toggleException,
	debugData,
	villeExceptions
}) => (
	<div css="background: white; width: 80%; margin: 0 auto">
		{debugData ? (
			<>
				{' '}
				<blockquote>{JSON.stringify(debugData, null, 2)}</blockquote>
				<a href={`https://www.openstreetmap.org/${debugData.id}`}>Page OSM</a>
				<button onClick={() => toggleException(ville, debugData.id)}>
					{villeExceptions.includes(debugData.id)
						? 'Re-sélectionner'
						: 'Mettre sur le banc'}
				</button>
				<button
					onClick={() =>
						navigator.clipboard.writeText(JSON.stringify(exceptions))
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
