'use client'
import CyclableScoreVignette from '@/CyclableScoreVignette'
import WalkableScoreVignette from '@/WalkableScoreVignette'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import villesList from '../villesClassées'

const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

async function getData(ville, then) {
	const response = await fetch(`/api/wikidata/${ville}`)

	if (!response.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch wiki data for ', ville)
	}
	const json = await response.json()
	then(json)
}

export default ({ ville, cyclable, data, i, gridView }) => {
	const [wikidata, setWikidata] = useState({})
	useEffect(() => {
		getData(cyclable ? métropoleToVille[ville] || ville : ville, setWikidata)
	}, [ville, cyclable])

	const imageURL = wikidata.image
	const medal = i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]

	return (
		<li
			key={ville}
			css={`
				> a {
					display: flex;
					flex-direction: column;
				}
			`}
		>
			<Link
				href={encodeURI((cyclable ? '/cyclables/' : '/pietonnes/') + ville)}
			>
				<h3
					css={`
						font-weight: bold;
						font-size: 130%;
						@media (min-width: 800px) {
							font-size: 160%;
						}
						margin: 0.4rem 0;
						${gridView &&
						`
						white-space: nowrap;
						max-width: 85%;
						overflow: scroll;`}
					`}
				>
					<span
						css={`
							width: 3rem;
							text-align: center;
						`}
					>
						{medal}&nbsp;
					</span>
					{ville}
				</h3>
				<div
					css={`
						display: flex;
						justify-content: start;
						align-items: center;
					`}
				>
					{imageURL && (
						<div
							css={`
								width: 75%;
								height: 8rem;
								@media (min-width: 800px) {
									height: 12rem;
								}
								img {
									border-radius: 1rem;
								}
								position: relative;
							`}
						>
							<Image
								src={imageURL}
								style={{ objectFit: 'cover' }}
								fill={true}
								alt={'Une photo emblématique du territoire mesuré (' + ville + ')'}
							/>
						</div>
					)}

					{cyclable ? (
						<CyclableScoreVignette score={data.score} />
					) : (
						<WalkableScoreVignette data={data} />
					)}
				</div>
			</Link>
		</li>
	)
}
