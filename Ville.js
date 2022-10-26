import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature } from 'react-mapbox-gl'
import APIUrl from './APIUrl'
import Logo from './Logo'
import { useParams, useLocation } from 'react-router-dom'
function useQuery() {
	return new URLSearchParams(useLocation().search)
}
import { blue, grey, Switch, styles } from './mapStyles'
import DebugMap from './DebugMap'
import DebugBlock from './DebugBlock'
import { normalizedScores } from './Classement'

const Map = ReactMapboxGl({
	accessToken:
		'pk.eyJ1Ijoia29udCIsImEiOiJjanRqMmp1OGsxZGFpNGFycnhjamR4b3ZmIn0.GRfAPvtZBKvOdpVYgfpGXg',
})

const cacheDisabled = true

let get = (ville, setData, debug = false) =>
	fetch(APIUrl + 'api/walking/' + (debug ? 'complete/' : 'merged/') + ville)
		.then((res) => res.json())
		.then((json) => {
			localforage.setItem(ville, json)
			setData(json)
		})
let getCached = (ville, setData, setRequesting) =>
	localforage.getItem(ville).then((value) => {
		if (value === 'requesting') return
		if (!value) {
			setRequesting(true)
			get(ville, setData).then(() => setRequesting(false))
		}
		setData(value)
	})
export default ({ exceptions, toggleException }) => {
	let { ville } = useParams()
	let [data, setData] = useState(null)
	let [requesting, setRequesting] = useState(null)
	let [style, setStyle] = useState('satellite')
	let query = useQuery()
	let debug = query.get('debug') != null
	let [debugData, setDebugData] = useState(null)

	useEffect(() => {
		debug
			? get(ville, setData, true)
			: cacheDisabled
			? get(ville, setData, false)
			: getCached(ville, setData, setRequesting)
	}, [debug, ville])

	let villeExceptions = exceptions[ville] || []

	return (
		<div
			css={`
				position: relative;
				color: black;
				display: flex;
				flex-direction: column;
				align-items: center;
				height: 100%;

				#switch,
				#scores {
					z-index: 20;

					background: #fffc;
					padding: 0 1rem;
					border-radius: 0.9rem;
					margin: 1rem 0;
				}
			`}
		>
			<div css="z-index: 20">
				<Logo
					color={!data ? undefined : style === 'satellite' ? 'white' : 'black'}
					text={ville}
				/>
				{debug && (
					<DebugBlock
						{...{
							exceptions,
							ville,
							toggleException,
							debugData,
							villeExceptions,
						}}
					/>
				)}
			</div>

			{!data && <p>Chargement en cours ⏳</p>}
			{data && data.realArea}
			<Switch {...{ setStyle, style }} />
			{data?.geoAPI && !debug && <Scores data={data} />}
			{data && (
				<div css="position: absolute; top: 0; z-index: 10">
					<Map
						style={'mapbox://styles/' + styles[style]}
						zoom={[12]}
						containerStyle={{
							height: '100vh',
							width: '100vw',
						}}
						center={
							data.geoAPI?.centre?.coordinates ||
							(data.center
								? data.center.geometry.coordinates
								: [-4.2097759, 48.5799039])
						}
					>
						{data?.geoAPI && (
							<Layer
								type="line"
								paint={{
									'line-width': 2,
									'line-dasharray': [1, 1],
									'line-color': {
										satellite: 'white',
										artistique: grey,
										carte: blue,
									}[style],
								}}
							>
								<Feature
									coordinates={data.geoAPI.contour.coordinates[0]}
								></Feature>
							</Layer>
						)}
						{!debug && (
							<GeoJSONLayer
								data={data.mergedPolygons}
								fillPaint={{
									'fill-color': {
										satellite: 'chartreuse',
										artistique: grey,
										carte: blue,
									}[style],
									'fill-opacity': style === 'carte' ? 0.65 : 0.75,
								}}
							/>
						)}
						{debug && data.polygons && (
							<DebugMap {...{ setDebugData, villeExceptions, data }} />
						)}
					</Map>
				</div>
			)}
		</div>
	)
}

const Scores = ({ data }) => {
	const { pedestrianArea, area, percentage, relativeArea } =
		normalizedScores(data)
	return (
		<div id="scores" title={`Surface complète, parcs compris : ${area}`}>
			{pedestrianArea.toFixed(1)} km² piétons sur {relativeArea.toFixed(1)} km²,
			soit {percentage.toFixed(1)}%
		</div>
	)
}
