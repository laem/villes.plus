import { Map, Marker, GeoJson } from 'pigeon-maps'
import { useEffect, useState } from 'react'

const computeBikeDistance = (from, to) =>
	fetch(
		`https://brouter.de/brouter?lonlats=${from.reverse().join(',')}|${to
			.reverse()
			.join(',')}&profile=shortest&alternativeidx=0&format=geojson`
	)
		.then((res) => res.json())
		.catch((e) => console.log(e))

const center = [48.10999850495452, -1.679193852233965]

export default () => {
	const [couple, setCouple] = useState({ from: null, to: null })
	console.log(couple)
	const [data, setData] = useState(null) // use an empty array as initial value

	useEffect(() => {
		if (!couple.to) return undefined
		computeBikeDistance(couple.from, couple.to).then((res) => {
			setData(res) // set the state
		})
	}, [couple])

	console.log(data)

	return (
		<div
			css={`
				max-width: 1000px;
				margin: 0 auto;
			`}
		>
			<h1>Ma ville est-elle cyclable ?</h1>
			<p>
				Précisons : <em>vraiment</em> cyclable, donc avec des pistes cyclables
				séparées.{' '}
			</p>
			<p>
				Pour le découvrir, cliquez 2 points sur la carte, on vous le dira. Puis
				recommencez :)
			</p>

			<Map
				height={'70vh'}
				width={'70vw'}
				defaultCenter={center}
				defaultZoom={13}
				onClick={({ event, latLng, pixel }) => {
					setCouple(!couple.from ? { from: latLng } : { ...couple, to: latLng })
				}}
			>
				{data && (
					<GeoJson
						data={data}
						styleCallback={(feature, hover) => {
							if (feature.geometry.type === 'LineString') {
								return { strokeWidth: '3', stroke: 'red' }
							}
							return {
								fill: '#d4e6ec99',
								strokeWidth: '1',
								stroke: 'white',
								r: '20',
							}
						}}
					/>
				)}
				{couple.from && <Marker width={50} anchor={couple.from} />}
				{couple.to && <Marker width={50} anchor={couple.to} />}
			</Map>
		</div>
	)
}
