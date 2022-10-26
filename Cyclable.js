import L from 'leaflet'
import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useParams } from 'react-router-dom'
import APIUrl from './APIUrl'
import Logo from './Logo'

const MapTilerKey = '1H6fEpmHR9xGnAYjulX3'

const defaultCenter = [48.10999850495452, -1.679193852233965]

export default () => {
	const { ville } = useParams()

	const [couple, setCouple] = useState({ from: null, to: null })

	const [clickedSegment, setClickedSegment] = useState()

	const [data, setData] = useState()

	useEffect(() => {
		const debug = false

		fetch(APIUrl + 'api/cycling/' + (debug ? 'complete/' : 'merged/') + ville)
			.then((res) => res.json())
			.then((json) => {
				setData(json)
			})
	}, [])

	useEffect(() => {
		// this is to add segments to your map. Nice feature, disabled as it evolved
		if (!(couple.to && couple.from)) return undefined
		computeBikeDistance(couple.from, couple.to).then((res) => {
			//setData(res) // set the state
		})
	}, [couple])
	if (!data) return <p css="text-align: center">Chargement...</p>
	const { segments, points, pointsCenter, score } = data

	console.log('segments', segments, segments.length)
	return (
		<div
			css={`
				max-width: 1000px;
				margin: 0 auto;
				padding: 1rem;
			`}
		>
			<Logo color={'black'} text={ville} cyclable />
			<h2>Ma métropole est-elle cyclable ?</h2>
			<p>
				Précisons : <em>vraiment</em> cyclable, donc avec des pistes cyclables
				séparées ou des voies où le vélo est prioritaire sur les voitures.
			</p>
			<p>
				La méthode de test : on calcule le trajet vélo le plus sécurisé entre
				les mairies des communes de la métropole. Attention : pour des raisons
				de performance, pour chaque mairie, seul les trajets vers les 4 mairies
				adjacentes sont testés.
			</p>
			{score && (
				<p>
					Ce trajet est <strong>sécurisé à {score}%</strong>.
				</p>
			)}
			<div css="height: 600px; width: 900px; > div {height: 100%; width: 100%}; margin-bottom: 2rem">
				{!pointsCenter ? (
					'Chargement des données'
				) : (
					<MapContainer
						center={
							(pointsCenter && pointsCenter.geometry.coordinates.reverse()) ||
							defaultCenter
						}
						style={{ maxWidth: '90vw' }}
						zoom={12}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; MapTiler'
							url={`https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=${MapTilerKey}`}
						></TileLayer>

						<GeoJSON
							key={segments.length}
							data={segments}
							eventHandlers={{
								mouseover: (e) => {
									setClickedSegment(e.sourceTarget.feature)
								},
							}}
							style={(feature) => ({
								...(feature.properties || {
									color: '#4a83ec',
									weight: 5,
									fillColor: '#1a1d62',
									fillOpacity: 1,
								}),
								...(clickedSegment === feature ? { color: 'chartreuse' } : {}),
							})}
						/>
						{points.map((point) => (
							<Marker
								position={[point.lat, point.lon]}
								icon={
									new L.Icon({
										iconUrl: 'https://openmoji.org/data/color/svg/E209.svg',
										iconSize: [30, 30],
									})
								}
							>
								<Popup>{JSON.stringify({ id: point.id, ...point.tags })}</Popup>
							</Marker>
						))}
					</MapContainer>
				)}
			</div>
			{clickedSegment && JSON.stringify(clickedSegment.properties)}
		</div>
	)
}
