'use client'

import { getDirectory } from '@/../algorithmVersion'
import {
	computeSafePercentage,
	createRidesPromises,
	getMessages,
	isValidRide,
	segmentGeoJSON,
} from '@/../computeCycling'
import isSafePath, { isVoieVerte } from '@/../isSafePath'
import { computePointsCenter, pointsProcess } from '@/../pointsRequest'
import APIUrl from '@/app/APIUrl'
import Loader from '@/Loader'
import L from 'leaflet'
import 'node_modules/leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useMap } from 'react-leaflet/hooks'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { io } from 'socket.io-client'
import { Legend, SegmentFilterButton, SegmentFilters, SmallLegend } from '../UI'
import AssoPromo from './AssoPromo'
import BottomLinks from './BottomLinks'
import MarkersWrapper from './MarkersWrapper'
import Rev from './Rev'
import segmentFilterSchema from './segmentFilters.yaml'
import segmentsSafeDistance from '@/../segmentsSafeDistance'
import CyclableScoreVignette from '@/CyclableScoreVignette'
import Link from 'next/link'

const defaultCenter = [48.10999850495452, -1.679193852233965]

const debug = false

const directory = getDirectory()

const defaultData = {
	points: [],
	pointsCenter: null,
	segments: [],
	rides: [],
	score: null,
}

export default ({ ville, osmId, clientProcessing, rev, data: givenData }) => {
	const id = osmId || ville

	const [couple, setCouple] = useState({ from: null, to: null })
	const [socket, setSocket] = useState(null)

	const [clickedSegment, setClickedSegment] = useState()
	const [clickedLatLon, setClickedLatLon] = useState()

	const [randomFilter, setRandomFilter] = useState(100)
	const [segmentFilter, setSegmentFilter] = useState({
		safe: true,
		unsafe: true,
		rev: false,
		green: false,
	})
	const [loadingMessage, setLoadingMessage] = useState(null)

	const [data, setData] = useState(
		givenData && !(givenData.status === 202) ? givenData : defaultData
	)

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
		if (clientProcessing) return undefined
		console.log('will downloadData')
		downloadData(null, socket)

		return () => {
			console.log('This will be logged on unmount')
		}
	}, [socket])
	useEffect(() => {
		if (!clientProcessing) return undefined
		downloadData(stopsNumber, null)

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
	//rides are not necessary when using server computed data
	const {
		segments,
		points: unfilteredPoints,
		pointsCenter,
		rides,
		score,
		ridesLength,
	} = data

	console.log(unfilteredPoints)
	const points = segmentFilter.rev
		? unfilteredPoints.filter((p) => p.tags.amenity === 'townhall')
		: unfilteredPoints

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
	const segmentsToDisplay = segments
		.filter(
			(segment) =>
				!clickedPoint ||
				segment.properties.fromPoint === clickedPoint ||
				(segment.properties.rides || []).find((r) => r[1] === clickedPoint)
		)
		.filter((segment) => {
			const safePath = isSafePath(segment.properties.tags)
			const voieVerte = isVoieVerte(segment.properties.tags)
			if (segmentFilter.safe && segmentFilter.unsafe) return true
			if (segmentFilter.unsafe) return !safePath
			if (segmentFilter.safe) return safePath
			if (segmentFilter.green) return voieVerte
		})

	// This recomputing of the safe distance is quite interesting, since it recalculates it from the segments from their coordinates, rather than from brouter's distance attributes
	// Differences can existe, but they need to be unsignificative OR be explained !
	const clientScore = segmentsSafeDistance(
		segments,
		segmentFilter.green && isVoieVerte
	)
	console.log('Score côté client ', clientScore, 'score côté serveur ', score)

	//client side count should be reimplemented
	if (loadingMessage)
		return (
			<>
				<Loader />
				<p>{loadingMessage}</p>
			</>
		)

	return (
		<>
			<AssoPromo ville={ville} />
			<SegmentFilters>
				{segmentFilterSchema.map(({ color, key, title }) => (
					<SegmentFilterButton
						$active={segmentFilter[key]}
						onClick={() =>
							setSegmentFilter({ ...segmentFilter, [key]: !segmentFilter[key] })
						}
					>
						<Legend color={color} /> {title}
					</SegmentFilterButton>
				))}
			</SegmentFilters>
			{segmentFilter.green && (
				<SmallLegend>
					En considérant les "voies vertes" comme sécurisées (
					<Link href="https://github.com/laem/villes.plus/issues/87">
						pourquoi elles ne le sont pas encore
					</Link>
					), le score passe à :{' '}
					<CyclableScoreVignette data={{ score: clientScore }} />
				</SmallLegend>
			)}
			<SmallLegend>Traits épais = reliant deux mairies.</SmallLegend>
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
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; CyclOSM'
							url={`https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png`}
							opacity="0.5"
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
									createStyle(
										feature.properties,
										clickedSegment === feature,
										segmentFilter
									)
								}
							/>
						)}
						<MarkersWrapper {...{ clickedPoint, setClickedPoint, points }} />
						{rev && segmentFilter.rev && <Rev data={rev} />}
					</MapContainer>
				)}
			</div>
			<div
				css={`
					min-height: 10rem;
					margin-bottom: 4rem;
				`}
			>
				<h3>Informations sur le segment cliqué</h3>
				{!clickedSegment && (
					<p>
						💡 Pour comprendre pourquoi un segment est classifié cyclable (bleu)
						ou non cyclable (rouge), cliquez dessus !
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
						<p>
							Ce segment est traversé {clickedSegment.properties.rides.length}{' '}
							fois, il compte donc autant de fois dans le score du territoire.
						</p>
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
				<BottomLinks ville={ville} />
			</div>
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
const createStyle = (properties, highlight, segmentFilter) =>
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
						: segmentFilter.green && isVoieVerte(properties.tags)
						? segmentFilterSchema.find(({ color, key }) => key === 'green')
								.color
						: properties.isSafePath
						? 'blue'
						: '#ff4800',
				dashArray: 'none',
		  }
		: { color: 'yellow', weight: 10, dashArray: '1.2rem', opacity: 1 }

function bytesCount(s, divider = 1000) {
	return new TextEncoder().encode(JSON.stringify(s)).length / divider
	T
}
