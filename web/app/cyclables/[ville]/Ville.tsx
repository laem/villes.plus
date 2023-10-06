'use client'

import { getDirectory } from '@/../algorithmVersion'
import {
	computeSafePercentage,
	createRidesPromises,
	getMessages,
	isValidRide,
	segmentGeoJSON,
} from '@/../computeCycling'
import isSafePath, { isSafePathV2Diff } from '@/../isSafePath'
import { computePointsCenter, pointsProcess } from '@/../pointsRequest'
import APIUrl from '@/app/APIUrl'
import CyclableScoreVignette from '@/CyclableScoreVignette'
import Loader from '@/Loader'
import L from 'leaflet'
import 'node_modules/leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useMap } from 'react-leaflet/hooks'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { io } from 'socket.io-client'
import { buttonCSS, Legend, SmallLegend } from '../UI'
import AssoPromo from './AssoPromo'
import MarkersWrapper from './MarkersWrapper'

const MapBoxToken =
	'pk.eyJ1Ijoia29udCIsImEiOiJjbGY0NWlldmUwejR6M3hyMG43YmtkOXk0In0.08u_tkAXPHwikUvd2pGUtw'

const defaultCenter = [48.10999850495452, -1.679193852233965]

const debug = false

const directory = getDirectory()

export default ({ ville, osmId, clientProcessing }) => {
	const id = osmId || ville

	const [couple, setCouple] = useState({ from: null, to: null })
	const [socket, setSocket] = useState(null)

	const [clickedSegment, setClickedSegment] = useState()
	const [clickedLatLon, setClickedLatLon] = useState()

	const [randomFilter, setRandomFilter] = useState(100)
	const [segmentFilter, setSegmentFilter] = useState(null)
	const [showV2NewRules, setShowV2NewRules] = useState(false)
	const [loadingMessage, setLoadingMessage] = useState(null)

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
			/* This idea was to have as many stop points as townhalls, but it was only applied in client mode, not server mode, yet
			townhallPoints.length > randomFilter
				? townhallPoints.length
				: randomFilter

				*/
			randomFilter

	const [clickedPoint, setClickedPoint] = useState(null)
	const downloadData = async (stopsNumber, socket) => {
		if (clientProcessing) {
			const points = await pointsProcess(id, stopsNumber),
				pointsCenter = computePointsCenter(points)
			setData((data) => ({ ...data, points, pointsCenter }))

			const rides = createRidesPromises(points)
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
			setLoadingMessage('⏳️ Téléchargement en cours des données...')
			console.log('will fetch', stopsNumber)
			fetch(
				APIUrl +
					'api/cycling/' +
					(debug ? 'complete/' : 'merged/') +
					id +
					'/' +
					getDirectory()
			)
				.then((r) =>
					r.json().then((data) => ({ status: r.status, body: data }))
				)
				.then(({ status, body }) => {
					console.log('S', status, body)
					if (status === 202) {
						setLoadingMessage('⚙️  Le calcul est lancé...')

						const dimension = `cycling`,
							scope = `merged`
						socket.emit(`api`, {
							dimension,
							scope,
							ville: id,
							directory,
						})
						const path = `api/${dimension}/${scope}/${id}/${directory}`
						socket.on(path, function (body) {
							console.log('did client on api', body)
							if (body.loading) setLoadingMessage(body.loading)
							else if (body.data) {
								fetch(APIUrl + '/revalide?path=/' + path)
								setData(body.data)
								setLoadingMessage(false)
							}
						})
					} else {
						setData(body)
						setLoadingMessage(false)
					}
				})
				.catch((e) =>
					console.log(
						"Problème de fetch de l'API de stockage des calculs pour " + id
					)
				)
		}
	}
	useEffect(() => {
		const newSocket = io(APIUrl.replace('http', 'ws'))
		if (!socket) setSocket(newSocket)
		newSocket.connect()
		console.log('le client a tenté de se connecter au socket')
		newSocket.emit('message-socket-initial')
	}, [])

	useEffect(() => {
		if (!clientProcessing) return undefined
		downloadData(stopsNumber, null)

		return () => {
			console.log('This will be logged on unmount')
		}
	}, [stopsNumber])
	useEffect(() => {
		if (clientProcessing) return undefined
		console.log('will downloadData')
		downloadData(null, socket)

		return () => {
			console.log('This will be logged on unmount')
		}
	}, [socket])

	useEffect(() => {
		// this is to add segments to your map. Nice feature, disabled as it evolved
		if (!(couple.to && couple.from)) return undefined
		createItinerary(couple.from, couple.to).then((res) => {
			//setData(res) // set the state
		})
	}, [couple])
	if (!data) return <p css="text-align: center">Chargement de la page...</p>
	function bytesCount(s, divider = 1000) {
		return new TextEncoder().encode(JSON.stringify(s)).length / divider
	}
	Object.entries(data).map(([k, v]) =>
		console.log(k, bytesCount(v, 1000 * 1000))
	)
	console.log('DATA', data)
	//rides are not necessary when using server computed data
	const {
		segments,
		points,
		pointsCenter,
		rides,
		score: serverScore,
		ridesLength,
	} = data

	const interactiveSegmentDemo = false
	useEffect(() => {
		if (!interactiveSegmentDemo) return
		let counter = 0
		const interval = setInterval(() => {
			setClickedSegment(segments[counter])
			counter += 1
		}, 50)
		return () => clearInterval(interval)
	}, [segments])
	console.log(segments)
	const segmentsToDisplay = segments
		.filter(
			(segment) =>
				!clickedPoint ||
				segment.properties.fromPoint === clickedPoint ||
				(segment.properties.rides || []).find((r) => r[1] === clickedPoint)
		)
		.filter(
			(segment) =>
				segmentFilter == null ||
				isSafePath(segment.properties.tags) === segmentFilter
		)
		.filter(
			(segment) =>
				showV2NewRules == false || isSafePathV2Diff(segment.properties.tags)
		)
	const score =
		serverScore ||
		computeSafePercentage(rides.map((ride) => getMessages(ride)).flat())
	const segmentCount = segments.reduce(
		(memo, next) => memo + (next.properties.rides || [1]).length,
		0
	)
	if (loadingMessage)
		return (
			<>
				<Loader />
				<p>{loadingMessage}</p>
			</>
		)

	return (
		<>
			<div
				css={`
					display: flex;
					align-items: center;
				`}
			>
				<div>
					{score != null ? (
						<p>
							<strong
								title={`Précisément, ${score}`}
								css={`
									background: yellow;
								`}
							>
								{Math.round(score)}%
							</strong>{' '}
							des trajets du territoires sont sécurisés
							<br />
							<SmallLegend>
								({points.length} points,{' '}
								{(ridesLength || rides.length).toLocaleString('fr-FR')}{' '}
								itinéraires, {segmentCount.toLocaleString('fr-FR')} segments)
							</SmallLegend>
						</p>
					) : (
						<p>{points.length} points.</p>
					)}
				</div>
			</div>
			<div
				css={`
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					margin-top: 1rem;
				`}
			>
				<button
					css={`
						${buttonCSS}

						${segmentFilter === true && `border: 2px solid; font-weight: bold`}
					`}
					onClick={() => setSegmentFilter(segmentFilter === true ? null : true)}
				>
					{' '}
					<Legend color="blue" /> segments cyclables
				</button>
				<button
					css={`
						${buttonCSS}
						${segmentFilter === false &&
						`border: 2px solid; font-weight: bold; `}
					`}
					onClick={() =>
						setSegmentFilter(segmentFilter === false ? null : false)
					}
				>
					<Legend color="red" /> le reste
				</button>
				{clientProcessing && (
					<button
						css={`
							${buttonCSS}
							${showV2NewRules && `border: 2px solid; font-weight: bold; `}
						`}
						onClick={() => setShowV2NewRules(!showV2NewRules)}
					>
						Montrer les nouveautés v2
					</button>
				)}
				<SmallLegend>Traits épais = reliant deux mairies.</SmallLegend>
			</div>
			{clientProcessing && (
				<div>
					<label>
						Nombre d'arrêts de bus sélectionnés aléatoirement{' '}
						<input
							value={randomFilter}
							onChange={(e) => setRandomFilter(e.target.value)}
						/>
					</label>
				</div>
			)}
			<AssoPromo ville={ville} />
			<div
				css={`
					margin-top: 0.2rem;
					height: 90vh;
					width: 90vw;
					max-width: 90vw !important;
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
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; MapBox'
							url={`https://api.mapbox.com/styles/v1/kont/clf45ojd3003301ln8rp5fomd/tiles/{z}/{x}/{y}?access_token=${MapBoxToken}`}
						></TileLayer>

						{segmentsToDisplay && (
							<GeoJSON
								key={segmentsToDisplay.length}
								data={segmentsToDisplay}
								eventHandlers={{
									click: (e) => {
										const { lat, lng: lon } = e.latlng
										setClickedLatLon(
											JSON.stringify(clickedLatLon) ===
												JSON.stringify({ lat, lon })
												? null
												: { lat, lon }
										)
										setClickedSegment(
											clickedSegment === e.sourceTarget.feature
												? null
												: e.sourceTarget.feature
										)
									},
								}}
								style={(feature) =>
									createStyle(feature.properties, clickedSegment === feature)
								}
							/>
						)}
						<MarkersWrapper {...{ clickedPoint, setClickedPoint, points }} />
					</MapContainer>
				)}
			</div>
			{console.log(clickedSegment) || (
				<div
					css={`
						min-height: 10rem;
						margin-bottom: 4rem;
					`}
				>
					<h3>Informations sur le segment cliqué</h3>
					{!clickedSegment && (
						<p>
							💡 Pour comprendre pourquoi un segment est classifié cyclable
							(bleu) ou non cyclable (rouge), cliquez dessus !
						</p>
					)}
					{clickedLatLon && (
						<div
							css={`
								a {
									display: block;
									margin: 0.2rem 0;
								}
							`}
						>
							<a
								href={`http://maps.google.com/maps?q=&layer=c&cbll=${clickedLatLon.lat},${clickedLatLon.lon}`}
								target="_blank"
							>
								📸 Vue Google StreetView
							</a>
							<a
								href={`https://www.openstreetmap.org/query?lat=${clickedLatLon.lat}&lon=${clickedLatLon.lon}`}
								target="_blank"
							>
								🗺️ Carte OpenStreetMap
							</a>
						</div>
					)}
					<br />
					{clickedSegment && (
						<div>
							Tags OSM du segment :{' '}
							<ul
								css={`
									margin-left: 2rem;
								`}
							>
								{clickedSegment.properties.tags.split(' ').map((tag) => (
									<li key={tag}>{tag}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</>
	)
}

function MapZoomer({ points }) {
	const map = useMap()
	useEffect(() => {
		var bounds = new L.LatLngBounds(
			points.map((point) => [point.lat, point.lon])
		)
		map.fitBounds(bounds, { padding: [20, 20] })
	}, [points])
}

const baseOpacity = 0.6
const createStyle = (properties, highlight) =>
	!highlight
		? {
				weight:
					properties.backboneRide || properties.rides?.some((r) => r[2])
						? '6'
						: '3',
				opacity:
					(properties.rides &&
						properties.rides.reduce(
							(memo, next) => memo + memo * baseOpacity,
							baseOpacity
						)) ||
					0.6,
				color:
					properties.isSafePath == null
						? properties.color
						: properties.isSafePath
						? 'blue'
						: '#ff4800',
				dashArray: 'none',
		  }
		: { color: 'yellow', weight: 10, dashArray: '1.2rem', opacity: 1 }
