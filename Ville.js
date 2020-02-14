import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import ReactMapboxGl, {
	GeoJSONLayer,
	Layer,
	Feature,
	Source
} from 'react-mapbox-gl'
import APIUrl from './APIUrl'
import Logo from './Logo'
import { useParams, useLocation } from 'react-router-dom'
function useQuery() {
	return new URLSearchParams(useLocation().search)
}

const Map = ReactMapboxGl({
	accessToken:
		'pk.eyJ1Ijoia29udCIsImEiOiJjanRqMmp1OGsxZGFpNGFycnhjamR4b3ZmIn0.GRfAPvtZBKvOdpVYgfpGXg'
})

// in render()

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
const sat = 'mapbox/satellite-v9',
	light = 'mapbox/streets-v10',
	rien = 'kont/ck60mhncx1z681ipczm7amthv'
export default ({ exceptions, toggleException }) => {
	let { ville } = useParams()
	let [data, setData] = useState(null)
	let [requesting, setRequesting] = useState(null)
	let [style, setStyle] = useState(sat)
	let query = useQuery()
	let debug = query.get('debug') === 'true'
	let [debugData, setDebugData] = useState(null)

	console.log(data)

	useEffect(() => {
		debug ? get(ville, setData, true) : getCached(ville, setData, setRequesting)
	}, [])

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
				<Logo color={style === sat ? 'white' : 'black'} text={ville} />
				{debug && (
					<div css="background: white; width: 80%; margin: 0 auto">
						{debugData ? (
							<>
								{' '}
								<blockquote>{JSON.stringify(debugData, null, 2)}</blockquote>
								<a href={`https://www.openstreetmap.org/${debugData.id}`}>
									Page OSM
								</a>
								<button onClick={() => toggleException(ville, debugData.id)}>
									{exceptions[ville] && exceptions[ville].includes(debugData.id)
										? 'Re-sélectionner'
										: 'Mettre sur le banc'}
								</button>
								<button
									onClick={() =>
										navigator.clipboard.writeText(JSON.stringify(exceptions))
									}
								>
									Copier les exceptions
								</button>
							</>
						) : (
							"Cliquez sur une forme pour l'inspecter"
						)}
					</div>
				)}
			</div>

			{!data && <p>Chargement en cours ⏳</p>}
			<div id="switch">
				<label>
					<input
						type="radio"
						name="style"
						value={sat}
						checked={style === sat}
						onChange={e => setStyle(e.target.value)}
					/>
					Vue satellite
				</label>
				<label>
					<input
						type="radio"
						name="style"
						value={rien}
						checked={style === rien}
						onChange={e => setStyle(e.target.value)}
					/>
					Vue artistique
				</label>
				<label>
					<input
						type="radio"
						name="style"
						value={light}
						checked={style === light}
						onChange={e => setStyle(e.target.value)}
					/>
					Vue carte
				</label>
			</div>
			{data && (
				<div css="position: absolute; top: 0; z-index: 10">
					<Map
						style={'mapbox://styles/' + style}
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
									style === light
										? '#3742fa'
										: style === rien
										? '#333'
										: 'chartreuse',
								'fill-opacity': style === light ? 0.65 : 0.75
							}}
						/>
						{debug && (
							<Layer
								type="fill"
								paint={{
									'fill-color': 'blue',
									'fill-opacity': 0.5
								}}
							>
								{console.log(data) ||
									data.polygons.features.map(polygon => (
										<Feature
											onClick={() => setDebugData(polygon.properties)}
											coordinates={polygon.geometry.coordinates}
										></Feature>
									))}
							</Layer>
						)}
					</Map>
				</div>
			)}
		</div>
	)
}
