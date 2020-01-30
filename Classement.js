import React, { useState, useEffect } from 'react'
import villesListRaw from 'js-yaml-loader!./villes.yaml'
import { Link } from 'react-router-dom'
import APIUrl from './APIUrl'
import { Logo } from './Router'

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

	console.log('villes', villes)
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
					ol {
						padding: 0;
						margin-top: 2rem;
					}

					ol > li {
						list-style-type: none;
					}

					li > a {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0.3rem 0.8rem;
						background: aliceblue;
						margin: 0.8rem;
						border-radius: 1rem;
						box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
							0 1px 2px rgba(41, 117, 209, 0.24);
					}
					li > a:hover {
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
				<ol>
					{villesEntries
						.sort(([, { area: a1 }], [, { area: a2 }]) => a2 - a1)
						.map(([ville, data], i) => (
							<li key={ville}>
								<Link to={'/' + ville}>
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
								</Link>
							</li>
						))}
				</ol>
			</div>
		</>
	)
}
