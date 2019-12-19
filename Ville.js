import React, { useState, useEffect } from 'react'
import { linesToPolygons, compute } from './allez'
import localforage from 'localforage'
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature } from 'react-mapbox-gl'

const Map = ReactMapboxGl({
	accessToken:
		'pk.eyJ1Ijoia29udCIsImEiOiJjanRqMmp1OGsxZGFpNGFycnhjamR4b3ZmIn0.GRfAPvtZBKvOdpVYgfpGXg'
})

// in render()

export default ({ match: { params } }) => {
	let ville = params.ville
	let [data, setData] = useState(null)
	useEffect(() => {
		localforage.getItem(ville).then(value => {
			if (!value) {
				fetch('http://localhost:3000/ville/' + ville)
					.then(res => console.log(res) || res.json())
					.then(json => {
						localforage.setItem(ville, json)
						setData(json)
					})
			}
			setData(value)
		})
	}, [])

	return (
		<div>
			<h1>{params.ville}</h1>
			<pre>
				{data &&
					JSON.stringify(
						{ ...data, geojson: data.geojson.features.length },
						null,
						'\t'
					)}
			</pre>
			Bientôt une carte
			<Map
				style="mapbox://styles/mapbox/streets-v9"
				containerStyle={{
					height: '100vh',
					width: '100vw'
				}}
				center={[-4.486076, 48.390394]}
			>
				{data && data.geojson && (
					<GeoJSONLayer
						data={linesToPolygons(data.geojson)}
						symbolLayout={{
							'text-field': '{place}',
							'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
							'text-offset': [0, 0.6],
							'text-anchor': 'top'
						}}
						fillPaint={{
							'fill-color': '#088',
							'fill-opacity': 0.8
						}}
					/>
				)}
			</Map>
			<button onClick={() => localforage.clear()}>Vider la mémoire</button>
		</div>
	)
}
