import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'
import ScoreLegend from '@/ScoreLegend'
import Shape from './Shape'

const converter = new GeoJSON2SVG()
export default async () => {
	const url =
		(process.env.VERCEL_ENV === 'development' ? '' : 'https://') +
		process.env.VERCEL_URL +
		'/cartes/data?maille=régions'
	console.log('CARTES URL', url, process.env.VERCEL_ENV)
	const req = await fetch(url)
	const data = await req.json()
	const geo = data.geojson

	const polygons = geo.features
	return (
		<div style={{ marginTop: '3rem' }}>
			<ScoreLegend scores={Object.entries(data.scores)} />
			<svg
				viewBox="0 20 270 140"
				style={{
					width: '100%',
					height: '100%',
					transform: 'scaleX(.75)',
					maxWidth: '70rem',
					margin: '0 auto',
					display: 'block',
				}}
			>
				{polygons.map((polygon) => (
					<Shape polygon={polygon} />
				))}
			</svg>
		</div>
	)
}
