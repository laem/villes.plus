import { Map, Marker, GeoJson } from 'pigeon-maps'
import { useEffect, useState } from 'react'

const center = [48.10999850495452, -1.679193852233965]

const isSafePath = (tags) =>
	tags.includes('highway=living_street') || tags.includes('highway=cycleway')

const computeBikeDistance = (from, to) =>
	fetch(
		`https://brouter.de/brouter?lonlats=${from.reverse().join(',')}|${to
			.reverse()
			.join(',')}&profile=safety&alternativeidx=0&format=geojson`
	)
		.then((res) => res.json())
		.catch((e) => console.log(e))

const segmentGeoJSON = (geojson) => {
	const [_, ...table] = geojson.features[0].properties.messages
	console.log('T', table)
	const coordinateStringToNumber = (string) => +string / 10e5
	const getLineCoordinates = (line) =>
			line && [line[0], line[1]].map(coordinateStringToNumber),
		getLineDistance = (line) => line[3],
		getLineTags = (line) => line[9]

	return {
		type: 'FeatureCollection',
		features: table
			.slice(0, -1)
			.map((line, i) => {
				// What a mess, this is hacky
				// TODO : the "messages" table contains way less segments than the LineString. They are grouped. We should reconstruct them as Brouter Web does
				const lineBis = table[i + 1]
				if (!lineBis) return

				return {
					type: 'Feature',
					properties: {
						tags: getLineTags(lineBis),
						distance: lineBis[3],
						elevation: lineBis[2],
						strokeWidth: '4px',
						stroke: isSafePath(getLineTags(lineBis)) ? 'blue' : 'red',
					},
					geometry: {
						type: 'LineString',
						coordinates: [
							getLineCoordinates(line),
							getLineCoordinates(table[i + 1]),
						],
					},
				}
			})
			.filter(Boolean),
	}
}
export default () => {
	const [couple, setCouple] = useState({ from: null, to: null })
	console.log(couple)
	const [data, setData] = useState(null) // use an empty array as initial value
	const [clickedSegment, setClickedSegment] = useState()

	useEffect(() => {
		if (!(couple.to && couple.from)) return undefined
		computeBikeDistance(couple.from, couple.to).then((res) => {
			const segmentedResult = segmentGeoJSON(res)
			console.log('YOYO', res, segmentedResult)
			setData(segmentedResult) // set the state
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
			{clickedSegment && JSON.stringify(clickedSegment)}

			<Map
				height={'800px'}
				width={'800px'}
				defaultCenter={center}
				defaultZoom={13}
				onClick={({ event, latLng, pixel }) => {
					console.log('click', event)
					setCouple(
						!couple.from
							? { from: latLng }
							: couple.to
							? { from: latLng }
							: { ...couple, to: latLng }
					)
				}}
			>
				{data && (
					<GeoJson
						onClick={({ event, anchor, payload }) => {
							setClickedSegment(payload.properties)
						}}
						data={data}
						styleCallback={(feature, hover) => {
							return feature.properties
						}}
					/>
				)}
				{couple.from && <Marker width={50} anchor={couple.from} />}
				{couple.to && <Marker width={50} anchor={couple.to} />}
			</Map>
		</div>
	)
}
