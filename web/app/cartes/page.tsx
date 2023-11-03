import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'

const converter = new GeoJSON2SVG()
export default async () => {
	const req = await fetch('http://localhost:8080/cartes/data')
	const geo = await req.json()

	const svgStrings = converter.convert(geo, {
		attributes: ['properties.osmId', 'properties.nom', 'properties.style'],
	})

	return (
		<svg
			viewBox="0 20 300 150"
			style={{
				width: '100%',
				height: '100%',
				transform: 'scaleX(.75);',
			}}
			dangerouslySetInnerHTML={{ __html: svgStrings.join('') }}
		></svg>
	)
}
