import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl'
import APIUrl from './APIUrl'
import Logo from './Logo'
import { useParams, useLocation } from 'react-router-dom'
function useQuery() {
	return new URLSearchParams(useLocation().search)
}
import { Switch, styles } from './mapStyles'
import DebugMap from './DebugMap'
import DebugBlock from './DebugBlock'

const Map = ReactMapboxGl({
	accessToken:
		'pk.eyJ1Ijoia29udCIsImEiOiJjanRqMmp1OGsxZGFpNGFycnhjamR4b3ZmIn0.GRfAPvtZBKvOdpVYgfpGXg'
})

const cacheDisabled = true

let get = (ville, setData, debug = false) =>
	fetch(APIUrl((debug ? 'complete/' : 'merged/') + ville))
		.then(res => res.json())
		.then(json => {
			localforage.setItem(ville, json)
			setData(json)
		})
let getCached = (ville, setData, setRequesting) =>
	localforage.getItem(ville).then(value => {
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
	let debug = query.get('debug') === 'true'
	let [debugData, setDebugData] = useState(null)

	useEffect(() => {
		debug
			? get(ville, setData, true)
			: cacheDisabled
			? get(ville, setData, false)
			: getCached(ville, setData, setRequesting)
	}, [])

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

				#switch {
					z-index: 20;

					background: #fffc;
					padding: 0 1rem;
					border-radius: 0.9rem;
					margin: 1rem 0;
				}
			`}
		>
			<div css="z-index: 20">
				<Logo color={style === 'satellite' ? 'white' : 'black'} text={ville} />
				{debug && (
					<DebugBlock
						{...{
							exceptions,
							ville,
							toggleException,
							debugData,
							villeExceptions
						}}
					/>
				)}
			</div>

			{!data && <p>Chargement en cours ⏳</p>}
			<Switch {...{ setStyle, style }} />
			{data && (
				<div css="position: absolute; top: 0; z-index: 10">
					<Map
						style={'mapbox://styles/' + styles[style]}
						zoom={[12]}
						containerStyle={{
							height: '100vh',
							width: '100vw'
						}}
						center={
							data.geoData?.centre?.coordinates ||
							(data.center
								? data.center.geometry.coordinates
								: [-4.2097759, 48.5799039])
						}
					>
						<GeoJSONLayer
							data={data.mergedPolygons}
							symbolLayout={{
								'text-field': '{place}',
								'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
								'text-offset': [0, 0.6],
								'text-anchor': 'top'
							}}
							fillPaint={{
								'fill-color':
									style === 'carte'
										? '#3742fa'
										: style === 'artistique'
										? '#333'
										: 'chartreuse',
								'fill-opacity': style === 'carte' ? 0.65 : 0.75
							}}
						/>
						{debug && data.polygons && (
							<DebugMap {...{ setDebugData, villeExceptions, data }} />
						)}
					</Map>
				</div>
			)}
		</div>
	)
}
