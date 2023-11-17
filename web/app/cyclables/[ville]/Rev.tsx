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
				const weight =
					{
						18: 10,
						17: 10,
						16: 9,
						15: 8,
						14: 7,
						13: 6,
						12: 6,
						11: 5,
						10: 4,
						9: 4,
					}[zoomLevel] || 4

				return feature.properties.ghost
					? { weight: weight * 1.5, color: 'blue', lineCap: 'unset' }
					: {
							weight,
							color: feature.properties.color || feature.properties.stroke,
					  }
			}}
		/>
	)
}
