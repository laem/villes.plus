import L from 'leaflet'
import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet/hooks'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { MapContainer } from 'react-leaflet/MapContainer'
import { FeatureGroup } from 'react-leaflet/FeatureGroup'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import APIUrl from './APIUrl'
import { Link } from 'react-router-dom'
import {
	isValidRide,
	ridesPromises,
	segmentGeoJSON,
	computeSafePercentage,
	getMessages,
} from './computeCycling'
import Logo from './Logo'
import { computePointsCenter, pointsProcess } from './pointsRequest'
import { isTownhall } from './utils'
import FriendlyObjectViewer from './utils/FriendlyObjectViewer'

const MapTilerKey = '1H6fEpmHR9xGnAYjulX3'

const defaultCenter = [48.10999850495452, -1.679193852233965]

const debug = false,
	clientProcessing = true

export default () => {
	const { ville } = useParams()

	const [couple, setCouple] = useState({ from: null, to: null })

	const [clickedSegment, setClickedSegment] = useState()

	const [randomFilter, setRandomFilter] = useState(100)

	const [data, setData] = useState({
		points: [],
		pointsCenter: null,
		segments: [],
		rides: [],
		score: null,
	})
	const townhallPoints = data.points.filter(
			(point) => point.tags.amenity === 'townhall'
		),
		stopsNumber =
			townhallPoints.length > randomFilter
				? townhallPoints.length
				: randomFilter

	const [clickedPoint, setClickedPoint] = useState(null)
	const downloadData = async (stopsNumber) => {
		if (clientProcessing) {
			const points = await pointsProcess(ville, stopsNumber),
				pointsCenter = computePointsCenter(points)
			setData((data) => ({ ...data, points, pointsCenter }))

			const rides = ridesPromises(points)
			rides.map((ride) =>
				ride.then((result) => {
					if (isValidRide(result)) {
						setData((data) => ({
							...data,
							rides: [...data.rides, result],
							segments: [
								...data.segments,
								segmentGeoJSON(result).features,
							].flat(),
						}))
					}
				})
			)
		} else {
			fetch(APIUrl + 'api/cycling/' + (debug ? 'complete/' : 'merged/') + ville)
				.then((res) => res.json())
				.then((json) => {
					setData(json)
				})
				.catch((e) => console.log("Problème de fetch de l'API"))
		}
	}

	useEffect(() => {
		downloadData(stopsNumber)

		return () => {
			console.log('This will be logged on unmount')
		}
	}, [stopsNumber])

	useEffect(() => {
		// this is to add segments to your map. Nice feature, disabled as it evolved
		if (!(couple.to && couple.from)) return undefined
		createItinerary(couple.from, couple.to).then((res) => {
			//setData(res) // set the state
		})
	}, [couple])
	if (!data) return <p css="text-align: center">Chargement de la page...</p>
	const { segments, points, pointsCenter, rides } = data
	const segmentsToDisplay = clickedPoint
		? segments.filter(
				(segment) =>
					console.log('SEG', segment) ||
					segment.properties.fromPoint === clickedPoint
		  )
		: segments
	const score = computeSafePercentage(
		rides.map((ride) => getMessages(ride)).flat()
	)
	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 0 auto;
				padding: 0.6rem;
				> * {
					max-width: 700px;
				}
				p {
					margin: 0.6rem;
				}
			`}
		>
			<Logo color={'black'} text={ville} cyclable />
			<h2>Mon territoire est-il cyclable ?</h2>
			<p>
				Précisons : <em>vraiment</em> cyclable, donc des voies cyclables
				séparées des voitures et piétons, ou des vélorues où le vélo est
				prioritaire.
			</p>
			<p>
				La méthode de test : on calcule le trajet vélo le plus sécurisé entre
				des points représentatifs du territoire : mairies et sélection d'arrêts
				de bus. Pour chaque point, les trajets vers les 4 points adjacents sont
				testés. <Link to="/explications/cyclable">En savoir plus</Link>.
			</p>
			{score ? (
				<p>
					Les trajets de cette métropole sont{' '}
					<strong
						title={`Précisément, ${score}`}
						css={`
							background: yellow;
						`}
					>
						sécurisés à {Math.round(score)}%
					</strong>
					,
					<br />
					pour {points.length} points, {rides.length} itinéraires,{' '}
					{segments.length} segments.
				</p>
			) : (
				<p>{points.length} points.</p>
			)}
			<p>
				En <Legend color="blue" /> les segments cyclables, en{' '}
				<Legend color="red" /> le reste.
			</p>
			<p>Traits épais = reliant deux mairies.</p>
			<div>
				<label>
					Nombre d'arrêts de bus sélectionnés aléatoirement{' '}
					<input
						value={randomFilter}
						onChange={(e) => setRandomFilter(e.target.value)}
					/>
				</label>
			</div>
			<div
				css={`
					height: 90vh;
					width: 90vw;
					max-width: 90vw;
					> div {
						height: 100%;
						width: 100%;
					}
					margin-bottom: 2rem;
				`}
			>
				{!pointsCenter ? (
					<div
						css={`
							margin: 0 auto;
							width: 20rem;
							margin: 2rem;
						`}
					>
						⏳️ Chargement des données, d'abord les points d'intérêt...
					</div>
				) : (
					<MapContainer
						center={
							(pointsCenter && pointsCenter.geometry.coordinates.reverse()) ||
							defaultCenter
						}
						zoom={12}
					>
						<MapZoomer points={points} />
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; MapTiler'
							url={`https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=${MapTilerKey}`}
						></TileLayer>

						{segmentsToDisplay && (
							<GeoJSON
								key={segmentsToDisplay.length}
								data={segmentsToDisplay}
								eventHandlers={{
									mouseover: (e) => {
										setClickedSegment(e.sourceTarget.feature)
									},
								}}
								style={(feature) => ({
									...(feature.properties || {
										color: '#4a83ec',
										weight: 5,
										fillColor: 'cyan',
										fillOpacity: 1,
									}),
									...(clickedSegment === feature
										? { color: 'chartreuse' }
										: {}),
								})}
							/>
						)}
						<FeatureGroup>
							{points.map((point) => (
								<Marker
									eventHandlers={{
										click: (e) => {
											setClickedPoint(
												clickedPoint === point.id ? null : point.id
											)
										},
									}}
									position={[point.lat, point.lon]}
									icon={
										new L.Icon({
											//										iconUrl:
											//
											iconUrl: goodIcon(point),
											iconSize: [20, 20],
										})
									}
								>
									<Popup>
										<FriendlyObjectViewer
											data={{ id: point.id, ...point.tags }}
										/>
									</Popup>
								</Marker>
							))}
						</FeatureGroup>
					</MapContainer>
				)}
			</div>
			{clickedSegment && (
				<FriendlyObjectViewer data={clickedSegment.properties} />
			)}
		</div>
	)
}

const goodIcon = (point) =>
	APIUrl + (isTownhall(point) ? 'images/townhall.svg' : 'images/bus.svg')

const Legend = styled.span`
	width: 2rem;
	height: 0.4rem;
	display: inline-block;
	vertical-align: middle;
	background: ${(props) => props.color};
`

function MapZoomer({ points }) {
	const map = useMap()
	useEffect(() => {
		var bounds = new L.LatLngBounds(
			points.map((point) => [point.lat, point.lon])
		)
		map.fitBounds(bounds, { padding: [20, 20] })
	}, [points])
}
