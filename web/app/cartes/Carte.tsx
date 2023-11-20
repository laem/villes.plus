import { GeoJSON2SVG } from 'geojson2svg'
import départementsScores from './data/départements.json'
const data = départementsScores
const geo = data.geojson
const converter = new GeoJSON2SVG()

export default function Carte() {
	const svgStrings = converter.convert(geo, {
		attributes: ['properties.osmId', 'properties.nom', 'properties.style'],
	})
	return (
		<svg
			viewBox="0 20 270 140"
			style={{
				width: '100%',
				height: '85%',
				transform: 'scaleX(.75)',
				maxWidth: '70rem',
				margin: '0 auto',
				display: 'block',
			}}
			dangerouslySetInnerHTML={{ __html: svgStrings.join('') }}
		></svg>
	)
}
