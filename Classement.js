import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import APIUrl from './APIUrl'
import Logo from './Logo'
import villesList from './villesClassées'
import Explication from './Explication'

export const normalizedScores = data => {
	const million = 1000 * 1000
	const pedestrianArea = data.pedestrianArea / million,
		relativeArea = data.relativeArea / million,
		area = data.geoAPI.surface / 100, // looks to be defined in the 'hectares' unit
		percentage = (pedestrianArea / relativeArea) * 100
	return { pedestrianArea, area, relativeArea, percentage }
}

export function Classement() {
	let [villes, setVilles] = useState({})

	useEffect(() => {
		let promises = villesList.map(ville =>
			fetch(APIUrl('meta/' + ville)).then(yo => yo.json())
		)
		Promise.all(promises).then(data => {
			let villes2 = data.reduce(
				(memo, next, i) => ({ ...memo, [villesList[i]]: next }),
				{}
			)
			setVilles(villes2)
		})
	}, [])
	let villesEntries = Object.entries(villes)

	return (
		<>
			<Logo />
			<div
				css={`
					max-width: 45rem;
					margin: 0 auto;
					padding: 0.6rem;
					h2 {
						font-size: 120%;
						font-weight: normal;
						text-align: center;
					}
					> ol {
						padding: 0;
						margin-top: 2rem;
					}

					> ol > li {
						list-style-type: none;
					}

					> ol > li > a {
						display: flex;
						justify-content: space-between;
						padding: 0.3rem 0.8rem;
						background: aliceblue;
						margin: 0.8rem 0;
						border-radius: 1rem;
						box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
							0 1px 2px rgba(41, 117, 209, 0.24);
					}

					> ol > li > a:hover {
						box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2),
							0px 4px 5px 0px rgba(41, 117, 209, 0.14),
							0px 1px 10px 0px rgba(41, 117, 209, 0.12);
					}
					li a {
						color: inherit;
					}
					/*
				li:nth-child(odd) {
					background: #eee;
				}
				*/
					a {
						font-size: 100%;
						text-decoration: none;
					}
				`}
			>
				<h2>Quelles grandes villes françaises sont les plus piétonnes 🚶‍♀️ ?</h2>
				{villesEntries.length === 0 && (
					<p css="font-weight: 600; margin-top: 3rem; text-align: center">
						Chargement en cours ⏳
					</p>
				)}
				{true && (
					<ol>
						{villesEntries
							.map(([ville, data]) => {
								if (!data || !data.geoAPI) return false
								return [ville, { ...data, ...normalizedScores(data) }]
							})
							.filter(Boolean)
							.sort(([, { percentage: a1 }], [, { percentage: a2 }]) => a2 - a1)
							.map(([ville, data], i) => {
								return (
									<li key={ville}>
										<Link to={'/' + ville}>
											<span css="width: 1.5rem; text-align: center">
												{i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]}&nbsp;
											</span>
											<div css="width: 8rem">{ville}</div>
											<div css="width: 4rem;text-align: center">
												<span css="font-weight: 600">
													{data.percentage.toFixed(0)}
												</span>
												<small> %</small>
											</div>
											<div css="width: 8rem; text-align: left">
												<span css="font-size: 80%; color: #1e3799">
													{data.pedestrianArea.toFixed(1)} sur{' '}
													{data.relativeArea.toFixed(1)} km²
												</span>
											</div>
										</Link>
									</li>
								)
							})}
					</ol>
				)}
				<Explication />
			</div>
		</>
	)
}
