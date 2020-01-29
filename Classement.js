import React, { useState, useEffect } from 'react'
import villesListRaw from 'js-yaml-loader!./villes.yaml'
import { Link } from 'react-router-dom'
import APIUrl from './APIUrl'
import Logo from './App'

let villesList = villesListRaw.slice(0, 10)
export function Classement() {
	let [villes, setVilles] = useState({})

	useEffect(() => {
		let promises = villesList.map(ville =>
			fetch(APIUrl('score/' + ville)).then(yo => yo.json())
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
					padding: 0.6rem;
					h2 {
						font-size: 120%;
						font-weight: normal;
						text-align: center;
					}
					ol {
						padding: 0;
					}

					li {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0.3rem 0.6rem;
						padding: 0.3rem 0;
						border-bottom: 1px solid #ccc;
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
				<h2>
					Quelles sont les grandes villes françaises les plus piétonnes 🚶‍♀️ ?
				</h2>
				{villesEntries.length === 0 && <p>Chargement en cours ⏳</p>}
				<ol>
					{villesEntries
						.sort(([, { area: a1 }], [, { area: a2 }]) => a1 < a2)
						.map(([ville, data], i) => (
							<li key={ville}>
								<span css="width: 1.5rem; text-align: center">
									{i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]}&nbsp;
								</span>
								<div css="width: 10rem">{ville}</div>
								<div>
									<span css="font-weight: 600">
										{data && (data.area / 1000000).toFixed(1)}{' '}
									</span>
									<small>km²</small>
								</div>
								<Link to={'/' + ville}>Explorer</Link>
							</li>
						))}
				</ol>
			</div>
		</>
	)
}
