'use client'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { FeatureGroup } from 'react-leaflet/FeatureGroup'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useMap } from 'react-leaflet/hooks'
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useSearchParams } from 'next/navigation'
import APIUrl from './APIUrl'
import {
	computeSafePercentage,
	getMessages,
	isValidRide,
	ridesPromises,
	segmentGeoJSON,
} from '../../../../computeCycling'
import Header from './cyclable/Header'
import isSafePath, { isSafePathV2Diff } from './isSafePath'
import Loader from './Loader'
import Meta from './Meta'
import { computePointsCenter, pointsProcess } from './pointsRequest'
import { buttonCSS, Legend, SmallLegend } from './UI'
import { isTownhall } from './utils'
import FriendlyObjectViewer from './utils/FriendlyObjectViewer'

const MapBoxToken =
	'pk.eyJ1Ijoia29udCIsImEiOiJjbGY0NWlldmUwejR6M3hyMG43YmtkOXk0In0.08u_tkAXPHwikUvd2pGUtw'

const defaultCenter = [48.10999850495452, -1.679193852233965]

const debug = false,
	clientProcessing = false

export default ({ params }) => {
	const { ville } = params,
		searchParams = useSearchParams(),
		osmId = searchParams.get('id')

	const id = osmId || ville

	const [couple, setCouple] = useState({ from: null, to: null })

	const [clickedSegment, setClickedSegment] = useState()

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
			townhallPoints.length > randomFilter
				? townhallPoints.length
				: randomFilter

	const [clickedPoint, setClickedPoint] = useState(null)
	const downloadData = async (stopsNumber) => {
		if (clientProcessing) {
			const points = await pointsProcess(id, stopsNumber),
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
			setLoadingMessage('⏳️ Téléchargement en cours des données...')
			fetch(APIUrl + 'api/cycling/' + (debug ? 'complete/' : 'merged/') + id)
				.then((res) => res.json())
				.then((json) => {
					setData(json)
					setLoadingMessage(false)
				})
				.catch((e) =>
					console.log(
						"Problème de fetch de l'API de stockage des calculs pour " + id
					)
				)
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
			<Meta title="Le classement des villes cyclables" />
			<Header ville={ville} />
			{loadingMessage && (
				<>
					<Loader />
					<p>{loadingMessage}</p>
				</>
			)}
			{!loadingMessage && (
				<>
					{score != null ? (
						<p>
							Les trajets de ce territoire sont{' '}
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
							<SmallLegend>
								(pour {points.length} points, {ridesLength || rides.length}{' '}
								itinéraires, {segmentCount} segments).
							</SmallLegend>
						</p>
					) : (
						<p>{points.length} points.</p>
					)}
					<div>
						<button
							css={`
								${buttonCSS}

								${segmentFilter === true &&
								`border: 2px solid; font-weight: bold`}
							`}
							onClick={() =>
								setSegmentFilter(segmentFilter === true ? null : true)
							}
						>
							{' '}
							En <Legend color="blue" /> les segments cyclables
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
							En <Legend color="red" /> le reste
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
					</div>
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
							margin-top: 1rem;
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
									(pointsCenter &&
										pointsCenter.geometry.coordinates.reverse()) ||
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
												setClickedSegment(
													clickedSegment === e.sourceTarget.feature
														? null
														: e.sourceTarget.feature
												)
											},
										}}
										style={(feature) => ({
											...createStyle(feature.properties),
											...(clickedSegment === feature
												? {
														color: 'yellow',
														weight: 10,
														dashArray: '1.2rem',
														opacity: 1,
												  }
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
				</>
			)}
		</div>
	)
}

const goodIcon = (point) =>
	APIUrl + (isTownhall(point) ? 'images/townhall.svg' : 'images/bus.svg')

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
const createStyle = (properties) => ({
	weight:
		properties.backboneRide || properties.rides?.some((r) => r[2]) ? '6' : '3',
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
})
