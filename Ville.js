import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import ReactMapboxGl, { GeoJSONLayer, Layer, Source } from 'react-mapbox-gl'
import APIUrl from './APIUrl'
import Logo from './Logo'

const Map = ReactMapboxGl({
	accessToken:
		'pk.eyJ1Ijoia29udCIsImEiOiJjanRqMmp1OGsxZGFpNGFycnhjamR4b3ZmIn0.GRfAPvtZBKvOdpVYgfpGXg'
})

// in render()

let get = (ville, setData) =>
	fetch(APIUrl('ville/' + ville))
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
export default ({ match: { params } }) => {
	let ville = params.ville
	let [data, setData] = useState(null)
	let [requesting, setRequesting] = useState(null)
	let [style, setStyle] = useState(sat)

	useEffect(() => {
		//get(ville, setData)
		getCached(ville, setData, setRequesting)
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

				> button {
					margin-top: auto;
				}
			`}
		>
			<div css="z-index: 20">
				<Logo color={style === sat ? 'white' : 'black'} text={params.ville} />
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
			{data && data.geojson && (
				<div css="position: absolute; top: 0; z-index: 10">
					<Map
						style={'mapbox://styles/' + style}
						zoom={[12]}
						containerStyle={{
							height: '100vh',
							width: '100vw'
						}}
						center={
							data.center
								? data.center.geometry.coordinates
								: [-4.2097759, 48.5799039]
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
						<GeoJSONLayer
							data={data.polygons}
							symbolLayout={{
								'text-field': '{place}',
								'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
								'text-offset': [0, 0.6],
								'text-anchor': 'top'
							}}
							fillPaint={{
								'fill-color': 'red',
								'fill-opacity': 0
							}}
						/>
					</Map>
				</div>
			)}
			<button onClick={() => localforage.clear()}>Vider la mémoire</button>
		</div>
	)
}
