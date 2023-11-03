import { Classement } from '@/app/Classement'
import { Metadata } from 'next'
import list from '@/départements.yaml'
import APIUrl from '@/app/APIUrl'
import { getDirectory } from '@/../algorithmVersion'
import { objectMap } from '@/../utils'

export const metadata: Metadata = {
	title: 'Le classement des régions les plus cyclables - villes.plus',

	description:
		'Chaque département est testé pour déterminer le pourcentage de km cyclables sécurisés, et la moyenne du score de chaque département fait le score de la région.',
	openGraph: {
		images: `https://ogenerateur.osc-fr1.scalingo.io/capture/${encodeURIComponent(
			`https://villes.plus/cyclables/regions`
		)}/shareImage?timeout=3000&width=1920&height=1080`,
	},
	twitter: {
		card: 'summary_large_image',
	},
}
Promise.delay = function (t, val) {
	return new Promise((resolve) => {
		setTimeout(resolve.bind(null, val), t)
	})
}

Promise.raceAll = function (promises, timeoutTime, timeoutVal) {
	return Promise.all(
		promises.map((p) => {
			return Promise.race([p, Promise.delay(timeoutTime, timeoutVal)])
		})
	)
}

export async function getData() {
	//.slice(0, 96) // not ready yet for worldwide tiles, we need to set up brouter, downloading all the tiles is huge
	// Only La Réunion is removed, we've got a problem with a small french town named La Réunion...

	const response = await Promise.raceAll(
		list.map(({ nom, nom_region: région }) => {
			const url = APIUrl + `api/cycling/meta/${nom}/${getDirectory()}`
			return fetch(url).then((r) =>
				r.json().then((data) => ({
					...data,
					status: r.status,
					département: nom,
					région,
				}))
			)
		}),
		6000,
		false
	)

	const régions = response.reduce((memo, next) => {
		const départements = [...(memo[next.région]?.départements || []), next]

		return {
			...memo,
			[next.région]: { départements, status: 200 },
		}
	}, {})

	const withMean = objectMap(régions, (région) => {
		const départements = région.départements

		const regularDépartements = départements.filter((d) =>
			d.département === 'Territoire-de-Belfort' ? false : true
		)
		const somme = regularDépartements
				.map((d) => d.score)
				.reduce((memo, next) => memo + next, 0),
			moyenne = somme / regularDépartements.length

		return { ...région, score: moyenne }
	})
	return withMean
}

export default async function Page() {
	const data = await getData()
	return (
		<Classement
			cyclable
			data={data}
			text={'Quelles régions françaises sont les plus cyclables ?'}
			onClickLinkToRegion={true}
		/>
	)
}
