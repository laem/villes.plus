import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'
import ScoreLegend from '@/ScoreLegend'

const converter = new GeoJSON2SVG()
export default async () => {
	const req = await fetch('http://localhost:8080/cartes/data')
	const data = await req.json()
	const geo = data.geojson

	const svgStrings = converter.convert(geo, {
		attributes: ['properties.osmId', 'properties.nom', 'properties.style'],
	})

	return (
		<div style={{ marginTop: '3rem' }}>
			<ScoreLegend scores={Object.entries(data.scores)} />
			<svg
				viewBox="0 20 270 140"
				style={{
					width: '100%',
					height: '100%',
					transform: 'scaleX(.75)',
				}}
				dangerouslySetInnerHTML={{ __html: svgStrings.join('') }}
			></svg>
		</div>
	)
}