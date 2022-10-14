import { Map, Marker } from 'pigeon-maps'
import { useState } from 'react'

export default () => {
	const [couple, setCouple] = useState({ from: null, to: null })
	console.log(couple)
	return (
		<div>
			<h1>Ma ville est-elle cyclable ?</h1>
			<p>
				Précisons : <em>vraiment</em> cyclable, donc avec des pistes cyclables
				séparées.{' '}
			</p>
			<p>
				Pour le découvrir, cliquez 2 points sur la carte, on vous le dira. Puis
				recommencez :)
			</p>
			{couple.from}
			{couple.to}

			<Map
				height={300}
				defaultCenter={[50.879, 4.6997]}
				defaultZoom={11}
				onClick={({ event, latLng, pixel }) => {
					setCouple(!couple.from ? { from: latLng } : { ...couple, to: latLng })
				}}
			>
				{couple.from && <Marker width={50} anchor={couple.from} />}
				{couple.to && <Marker width={50} anchor={couple.to} />}
			</Map>
		</div>
	)
}
