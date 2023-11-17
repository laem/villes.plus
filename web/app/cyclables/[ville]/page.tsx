import { Metadata } from 'next'
import Header from './Header'
import { Wrapper } from './UI'
const Ville = dynamic(() => import('./Ville'), {
	loading: () => 'Chargement de la carte...',
	ssr: false,
})

import wikidata from '@/app/wikidata'
import villesList from '@/villesClassées'
import { Suspense } from 'react'
import getRev from './getRev'

import { getDirectory } from '@/../algorithmVersion'
import { processName } from '@/../cyclingPointsRequests'
import APIUrl from '@/app/APIUrl'
import dynamic from 'next/dynamic'
const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

export async function generateMetadata({ params }): Promise<Metadata> {
	const villeRaw = decodeURIComponent(params.ville),
		ville = processName(villeRaw)

	try {
		const response = await wikidata(métropoleToVille[ville] || ville)

		const image = response.image,
			images = [image].filter(Boolean)

		const title = `${ville} - Carte cyclable - villes.plus`
		const description = `${ville} est-elle cyclable ? Découvrez le score de cyclabilité de ce territoire. Une centaines d'itinéraires sont testés chaque mois pour compter ceux qui se font sur voie et piste cyclables sécurisées. Cela donne un score de cyclabilité sur 10.`
		return {
			title,
			description,
			openGraph: {
				images,
				title,
				description,
				type: 'article',
				publishedTime: new Date().toISOString(),
			},
		}
	} catch (e) {
		console.log('oups', e)
	}
}

async function getData(ville, id) {
	const url = APIUrl + `api/cycling/merged/${id || ville}/${getDirectory()}`
	const res = await fetch(url)

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data for cyclables ville ' + url)
	}
	const text = await res.text()
	try {
		const json = JSON.parse(text)
		return { ...json, status: res.status }
	} catch (e) {
		console.log('oups parsing json for cyclable ville', e)
	}
}

export default async function Page({ params, searchParams }) {
	const { ville: villeRaw } = params,
		ville = decodeURIComponent(villeRaw),
		osmId = searchParams.id,
		clientProcessing = searchParams.client
	const data = await getData(villeRaw, osmId)
	const rev = await getRev(ville)
	console.log('REV', rev, ville)
	return (
		<Wrapper>
			<Header ville={ville} data={data} />
			<Suspense fallback={<Fallback />}>
				<Ville {...{ osmId, ville, clientProcessing, rev }} />
			</Suspense>
		</Wrapper>
	)
}

const Fallback = () => <div>Chargement de la carte dynamique</div>
