import ScoreLegend from '@/ScoreLegend'
import Carte from './Carte'
import départementsScores from './data/départements.json'
const data = départementsScores

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

	return (
		<div style={{ marginTop: '3rem' }}>
			<h1 style={{ margin: '1rem 0 0 0', textAlign: 'center' }}>
				Carte de la cyclabilité des départements
			</h1>
			<Carte />
			<ScoreLegend scores={Object.entries(data.scores)} />
			<p style={{ textAlign: 'center' }}>
				Source : villes.plus/cyclables/departements
			</p>
		</div>
	)
}
