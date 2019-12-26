import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import ReactMapboxGl, { GeoJSONLayer, Layer, Feature } from 'react-mapbox-gl'
import APIUrl from './APIUrl'

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

export default ({ match: { params } }) => {
	let ville = params.ville
	let [data, setData] = useState(null)
	let [requesting, setRequesting] = useState(null)

	useEffect(() => {
		//get(ville, setData)
		getCached(ville, setData, setRequesting)
	}, [])

	data && console.log('DATA', data)

	return (
		<div>
			<h1>{params.ville}</h1>
			{!data && <p>Chargement en cours ⏳</p>}
			<button onClick={() => localforage.clear()}>Vider la mémoire</button>
			{data && data.geojson && (
				<Map
					style="mapbox://styles/mapbox/satellite-v9"
					zoom={[12]}
					containerStyle={{
						height: '75vh',
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
							'fill-color': 'chartreuse',
							'fill-opacity': 0.6
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
							'fill-opacity': 0.6
						}}
					/>
				</Map>
			)}
		</div>
	)
}
