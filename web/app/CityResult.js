'use client'
import CyclableScoreVignette from '@/CyclableScoreVignette'
import WalkableScoreVignette from '@/WalkableScoreVignette'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import villesList from '../villesClassées'
import { io } from 'socket.io-client'
import { processName } from '../../cyclingPointsRequests'

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

export default ({ ville, cyclable, data: initialData, i, gridView }) => {
	const [wikidata, setWikidata] = useState({})
	const [loadingMessage, setLoadingMessage] = useState(null)
	const [socketData, setSocketData] = useState(null)
	const villeName = processName(ville)

	useEffect(() => {
		getData(
			processName(cyclable ? métropoleToVille[ville] || ville : ville),
			setWikidata
		)
	}, [ville, cyclable])

	const imageURL = wikidata.image
	const medal = i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]

	useEffect(() => {
		const socket = io('ws://localhost:3000')
		socket.connect()
		console.log('le client a tenté de se connecter au socket')
		socket.emit('message-socket-initial')

		if (initialData.status === 202) {
			setLoadingMessage('⚙️  Le calcul est lancé...')

			const dimension = `cycling`,
				scope = `meta`
			socket.emit(`api`, { dimension, scope, ville })
			socket.on(`api/${dimension}/${scope}/${ville}`, function (body) {
				if (body.loading) setLoadingMessage(body.loading)
				else if (body.data) {
					setSocketData(body.data)
					setLoadingMessage(false)
				}
			})
		}
	}, [])

	const data = socketData || initialData
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
					{villeName}
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
								alt={`Une photo emblématique du territoire mesuré (${ville})`}
							/>
						</div>
					)}

					{loadingMessage ? (
						<div>{loadingMessage}</div>
					) : cyclable ? (
						<CyclableScoreVignette score={data.score} />
					) : (
						<WalkableScoreVignette data={data} />
					)}
				</div>
			</Link>
		</li>
	)
}
