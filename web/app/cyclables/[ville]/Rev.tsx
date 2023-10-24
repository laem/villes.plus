import { useState } from 'react'
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useMapEvents } from 'react-leaflet'

const createBorders = (data) => ({
	type: 'FeatureCollection',
	features: [
		...data.features
			.map((el) => [
				{
					...el,
					properties: { ...el.properties, ghost: true },
				},
				el,
			])
			.flat(),
	],
})
export default function Rev({ data }) {
	const [zoomLevel, setZoomLevel] = useState(5) // initial zoom level provided for MapContainer

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom())
		},
	})
	console.log({ zoomLevel })
	const newData = createBorders(data)
	console.log('ND', newData)
	return (
		<GeoJSON
			key={'rev'}
			data={newData}
			style={(feature) => {
				const weight = { 14: 6, 13: 6, 12: 6, 11: 5, 10: 4, 9: 4 }[zoomLevel]

				return feature.properties.ghost
					? { weight: weight * 2, color: 'white' }
					: {
							weight,
							color: feature.properties.color,
					  }
			}}
		/>
	)
}
