import React, { useState, useEffect } from 'react'
import villesListRaw from 'js-yaml-loader!./villes.yaml'
import { Link } from 'react-router-dom'
import APIUrl from './APIUrl'

let villesList = ['Brest', 'Rennes'] || villesListRaw.slice(20, 22)
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
	return (
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
			<ol>
				{Object.entries(villes).map(([ville, data], i) => (
					<li key={ville}>
						{i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]}&nbsp;
						<div css="width: 60%">{ville}</div>
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
	)
}
