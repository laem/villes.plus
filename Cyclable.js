import L from 'leaflet'
import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { MapContainer } from 'react-leaflet/MapContainer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import APIUrl from './APIUrl'
import Logo from './Logo'
import { computePointsCenter, pointsProcess } from './pointsRequest'
import { isTownhall } from './utils'

const MapTilerKey = '1H6fEpmHR9xGnAYjulX3'

const defaultCenter = [48.10999850495452, -1.679193852233965]

const debug = false,
	clientProcessing = true

export default () => {
	const { ville } = useParams()

	const [couple, setCouple] = useState({ from: null, to: null })

	const [clickedSegment, setClickedSegment] = useState()

	const [data, setData] = useState()

	useEffect(async () => {
		if (clientProcessing) {
			const points = await pointsProcess(ville),
				pointsCenter = computePointsCenter(points)
			setData({ points, pointsCenter })
		} else {
			fetch(APIUrl + 'api/cycling/' + (debug ? 'complete/' : 'merged/') + ville)
				.then((res) => res.json())
				.then((json) => {
					setData(json)
				})
				.catch((e) => console.log("Problème de fetch de l'API"))
		}
		return
	}, [])

	useEffect(() => {}, [])

	useEffect(() => {
		// this is to add segments to your map. Nice feature, disabled as it evolved
		if (!(couple.to && couple.from)) return undefined
		computeBikeDistance(couple.from, couple.to).then((res) => {
			//setData(res) // set the state
		})
	}, [couple])
	if (!data) return <p css="text-align: center">Chargement...</p>
	const { segments, points, pointsCenter, score } = data
	console.log('points', points)

	console.log('segments', segments, segments?.length)
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
				adjacentes sont testés. Cela peut{' '}
				<a href="https://twitter.com/maeool/status/1585356672440348672">
					désavantager les coeurs de ville, souvent plus cyclables
				</a>
				.
			</p>
			{score ? (
				<p>
					Les trajets de cette métropole sont{' '}
					<strong>sécurisés à {score}%</strong>, pour {points.length} points.
				</p>
			) : (
				<p>{points.length} points.</p>
			)}
			<p>
				En <Legend color="blue" /> les segments cyclables, en{' '}
				<Legend color="red" /> le reste.
			</p>
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
					'Chargement des données'
				) : (
					<MapContainer
						center={
							(pointsCenter && pointsCenter.geometry.coordinates.reverse()) ||
							defaultCenter
						}
						zoom={12}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; MapTiler'
							url={`https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=${MapTilerKey}`}
						></TileLayer>

						{segments && (
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
										fillColor: 'cyan',
										fillOpacity: 1,
									}),
									...(clickedSegment === feature
										? { color: 'chartreuse' }
										: {}),
								})}
							/>
						)}
						{points.map((point) => (
							<Marker
								position={[point.lat, point.lon]}
								icon={
									new L.Icon({
										//										iconUrl:
										//
										iconUrl: goodIcon(point),
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

const goodIcon = (point) =>
	isTownhall(point)
		? 'https://openmoji.org/data/color/svg/E209.svg'
		: 'https://openmoji.org/data/color/svg/1F68D.svg'

const Legend = styled.span`
	width: 2rem;
	height: 0.4rem;
	display: inline-block;
	vertical-align: middle;
	background: ${(props) => props.color};
`
