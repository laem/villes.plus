import { Map, Marker, GeoJson } from 'pigeon-maps'
import { useEffect, useState } from 'react'
import { maptiler } from 'pigeon-maps/providers'
import { useParams } from 'react-router-dom'

const provider = maptiler('1H6fEpmHR9xGnAYjulX3', 'toner')

const center = [48.10999850495452, -1.679193852233965]
const request = (name) => `

[out:json][timeout:25];
( area[name="${name}"]; )->.searchArea;
(
  node["amenity"="townhall"](area.searchArea);
  way["amenity"="townhall"](area.searchArea);

   	
 
);
// print results
out body;
>;
out skel qt;
`
const OverpassInstance = 'https://overpass-api.de/api/interpreter'

export default () => {
	const { ville } = useParams()

	const [couple, setCouple] = useState({ from: null, to: null })
	const [rawData, setData] = useState(null) // use an empty array as initial value
	const [clickedSegment, setClickedSegment] = useState()
	const [rides, setRides] = useState([])

	useEffect(() => {
		if (!(couple.to && couple.from)) return undefined
		computeBikeDistance(couple.from, couple.to).then((res) => {
			setData(res) // set the state
		})
	}, [couple])

	useEffect(() => {
		if (!ville) return
		const myRequest = `${OverpassInstance}?data=${request(ville)}`

		fetch(encodeURI(myRequest))
			.then((res) => {
				if (!res.ok) {
					throw res
				}
				return res.json()
			})
			.then((json) => {
				const points = json.elements.slice(0, 4)
				points.map((p) =>
					points.map(
						(p2) =>
							p2 !== p &&
							computeBikeDistance([p.lat, p.lon], [p2.lat, p2.lon]).then(
								(res) => setRides((rides) => [...rides, res])
							)
					)
				)
			})
			.catch((error) => console.log('erreur dans la requête OSM', error))
	}, [])

	console.log('O', rides)
	const data = rawData && segmentGeoJSON(rawData)

	const safePercentage = rawData && computeSafePercentage(getMessages(rawData))

	console.log(couple)

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
				séparées ou des voies où le vélo est prioritaire sur les voitures.{' '}
			</p>
			<p>Pour le découvrir, cliquez 2 points sur la carte, on vous le dira. </p>
			<p>Puis recommencez :)</p>
			{data && (
				<p>
					Ce trajet est <strong>sécurisé à {safePercentage}%</strong>.
				</p>
			)}
			{clickedSegment && JSON.stringify(clickedSegment)}

			<Map
				provider={provider}
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
				{couple.from && <Marker width={50} anchor={couple.from} />}
				{couple.to && <Marker width={50} anchor={couple.to} />}
				{rides.length > 0 &&
					rides.map((ride) => (
						<GeoJson
							data={segmentGeoJSON(ride)}
							styleCallback={myStyleCallback}
						/>
					))}
				{data && (
					<GeoJson
						onClick={({ event, anchor, payload }) => {
							setClickedSegment(payload.properties)
						}}
						data={data}
						styleCallback={myStyleCallback}
					/>
				)}
			</Map>
		</div>
	)
}

const myStyleCallback = (feature, hover) => {
	return feature.properties
}

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

const getMessages = (geojson) => {
	const [_, ...table] = geojson.features[0].properties.messages

	return table
}
const computeSafePercentage = (messages) => {
	const [safeDistance, total] = messages.reduce(
		(memo, next) => {
			const safe = isSafePath(next[9]),
				distance = next[3]
			console.log(next[9], distance)
			return [memo[0] + (safe ? +distance : 0), memo[1] + +distance]
		},
		[0, 0]
	)
	console.log('safe', safeDistance)

	return Math.round((safeDistance / total) * 100)
}
const segmentGeoJSON = (geojson) => {
	const table = getMessages(geojson)
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
