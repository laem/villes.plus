import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'
import ScoreLegend from '@/ScoreLegend'
import départementsScores from './data/départements.json'
import régionsScores from './data/régions.json'

const converter = new GeoJSON2SVG()
export default async () => {
	/*
	const url =
		(process.env.VERCEL_ENV === 'development' ? '' : 'https://') +
		process.env.VERCEL_URL +
		'/cartes/data?maille=départements'
	console.log('CARTES URL', url, process.env.VERCEL_ENV)
	const req = await fetch(url)
	const data = await req.json()
		*/
	const data = départementsScores
	const geo = data.geojson

	const svgStrings = converter.convert(geo, {
		attributes: ['properties.osmId', 'properties.nom', 'properties.style'],
	})

	return (
		<div style={{ marginTop: '3rem' }}>
			<h1 style={{ margin: '1rem 0 0 0', textAlign: 'center' }}>
				Carte de la cyclabilité des départements
			</h1>
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
			<ScoreLegend scores={Object.entries(data.scores)} />
			<p style={{ textAlign: 'center' }}>
				Source : villes.plus/cyclables/departements
			</p>
		</div>
	)
}
