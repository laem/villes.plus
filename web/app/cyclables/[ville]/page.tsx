import { Metadata } from 'next'
import Header from './Header'
import { Wrapper } from './UI'
import Ville from './Ville'

import wikidata from '@/app/wikidata'
import villesList from '@/villesClassées'
import { Suspense } from 'react'

import { getDirectory } from '@/../algorithmVersion'
import { processName } from '@/../cyclingPointsRequests'
import APIUrl from '@/app/APIUrl'
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

		return {
			title: `${ville} - Carte cyclable - villes.plus`,
			description: `À quel point ${ville} est-elle cyclable ?`,
			openGraph: { images },
		}
	} catch (e) {
		console.log('oups', e)
	}
}

async function getData(ville) {
	const url = APIUrl + `api/cycling/merged/${ville}/${getDirectory()}`
	const res = await fetch(url)

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data for cyclables ville ' + url)
	}
	const text = await res.text()
	console.log('t', text, url)
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
	const data = await getData(villeRaw)
	return (
		<Wrapper>
			<Header ville={ville} data={data} />

			<Suspense fallback={<Fallback />}>
				<Ville {...{ osmId, ville, clientProcessing, data }} />
			</Suspense>
		</Wrapper>
	)
}

const Fallback = () => <div>Chargement de la carte dynamique</div>
