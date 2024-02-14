'use client'

import { isTownhall } from '@/../utils'
import FriendlyObjectViewer from '@/FriendlyObjectViewer'
import L from 'leaflet'
import '@/node_modules/leaflet/dist/leaflet.css'
import { useState } from 'react'
import { FeatureGroup } from 'react-leaflet/FeatureGroup'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { useMapEvents } from 'react-leaflet'
import { defaultZoom } from './Ville'

export default function MyComponent({ points, setClickedPoint, clickedPoint }) {
	const [zoomLevel, setZoomLevel] = useState(defaultZoom) // initial zoom level provided for MapContainer

	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom())
		},
	})
	console.log('ZL', zoomLevel)

	return (
		<FeatureGroup>
			{points.map((point) => (
				<Marker
					key={point.lat + point.lon}
					eventHandlers={{
						click: (e) => {
							setClickedPoint(clickedPoint === point.id ? null : point.id)
						},
					}}
					position={[point.lat, point.lon]}
					icon={
						new L.Icon({
							//										iconUrl:
							//
							iconUrl: goodIcon(point),
							iconSize: goodIconSize(zoomLevel, isTownhall(point)),
						})
					}
				>
					<Popup>
						<FriendlyObjectViewer data={{ id: point.id, ...point.tags }} />
					</Popup>
				</Marker>
			))}
		</FeatureGroup>
	)
}
const bi = (n) => [n, n]
const goodIconSize = (zoom, big) => {
	const sizes = bi(Math.max(0, (big ? 1.2 : 1) * 2.5 * zoom - 16)) // I have a doctorate in zoom to icon size study

	return sizes
}

const goodIcon = (point) => (isTownhall(point) ? '/townhall.svg' : '/bus.svg')
