'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import CityResult from './CityResult'
import Logo from './Logo'
import algorithmVersion from '../../algorithmVersion'
import { ClassementWrapper, NewCityLink } from './ClassementUI'
import ScoreLegend from '@/ScoreLegend'
import { io } from 'socket.io-client'
import APIUrl from '@/app/APIUrl'

export const normalizedScores = (data) => {
	const million = 1000 * 1000
	const pedestrianArea = data.pedestrianArea / million,
		relativeArea = data.relativeArea / million,
		area = data.geoAPI.surface / 100, // looks to be defined in the 'hectares' unit
		percentage = (pedestrianArea / relativeArea) * 100
	return { pedestrianArea, area, relativeArea, percentage }
}

export function Classement({ cyclable, data, text, level }) {
	const villes = data
	console.log('VILLES', villes)

	let villesEntries = Object.entries(villes)

	const [gridView, setGridView] = useState(false)
	const [socket, setSocket] = useState(null)
	const counterLevel =
		level && (level === 'metropoles' ? 'communes' : 'metropoles')
	useEffect(() => {
		const socket = io(APIUrl.replace('http', 'ws'))
		setSocket(socket)
		socket.connect()
		console.log('le client a tenté de se connecter au socket')
		socket.emit('message-socket-initial')
	}, [setSocket])

	return (
		<>
			<Logo animate cyclable={cyclable} />
			<ClassementWrapper gridView={gridView}>
				<h2>
					{text ||
						(cyclable
							? `Quelles ${level} françaises sont les plus cyclables ?`
							: 'Quelles grandes villes françaises sont les plus piétonnes ?')}
				</h2>
				{counterLevel && cyclable && (
					<div>
						<Link
							href={`/cyclables/${counterLevel}`}
							css={`
								display: flex;
								align-items: center;
								justify-content: center;
							`}
						>
							<img
								src={`/${counterLevel}.svg`}
								css={`
									width: 2rem;
									height: auto;
									margin-right: 0.6rem;
								`}
							/>{' '}
							<div>Voir le classement des {counterLevel}</div>
						</Link>
					</div>
				)}
				<p
					css={`
						text-align: center;
						button {
							margin-left: 0.6rem;
						}
					`}
				>
					🗓️{' '}
					{new Date().toLocaleString('fr-FR', {
						month: 'long',
						year: 'numeric',
					})}{' '}
					-{' '}
					{cyclable ? (
						<Link href="/explications/cyclables">algo {algorithmVersion}</Link>
					) : (
						<Link href="/explications/pietonnes">algo v1</Link>
					)}
					<button onClick={() => setGridView(!gridView)}>🪟 vue grille</button>
				</p>
				{villesEntries.length === 0 && (
					<p
						css={`
							font-weight: 600;
							margin-top: 3rem;
							text-align: center;
						`}
					>
						Chargement en cours ⏳
					</p>
				)}

				{cyclable && <ScoreLegend scores={villesEntries} />}
				{
					<ol
						css={`
							${gridView
								? `
							display: flex; flex-wrap: wrap;
							justify-content: center;
							padding: 0 1rem !important;
							li {width: 28rem; height: 20rem; justify-content: center; align-items: center}

							`
								: ''}
						`}
					>
						{villesEntries
							.map(([ville, data]) => {
								if (cyclable) return [ville, data]
								if (!data || !data.geoAPI)
									return [ville, { percentage: -Infinity }]
								return [ville, { ...data, ...normalizedScores(data) }]
							})
							.sort(([, v1], [, v2]) =>
								cyclable
									? v2?.score - v1?.score
									: v2?.percentage - v1?.percentage
							)
							.map(([ville, data], i) => {
								return (
									<CityResult
										key={ville}
										{...{ gridView, ville, cyclable, data, i }}
										socket={socket}
									/>
								)
							})}
					</ol>
				}
			</ClassementWrapper>
			<NewCityLink />
		</>
	)
}
