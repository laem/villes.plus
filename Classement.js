import React, { useState, useEffect } from 'react'
import villesListRaw from 'js-yaml-loader!./villes.yaml'
import { Link } from 'react-router-dom'
let villesList = villesListRaw.slice(20, 22)
export function Classement() {
	let [villes, setVilles] = useState({})

	useEffect(() => {
		let promises = villesList.map(ville =>
			fetch('http://localhost:3000/score/' + ville).then(yo => yo.json())
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
		<div>
			<h2>Classement</h2>
			<ul>
				{Object.entries(villes).map(([ville, data]) => (
					<li key={ville}>
						<div>
							{ville} : {data && (data.area / 1000000).toFixed(2)}
						</div>
						<Link to={'/' + ville}>🗺 Explorer</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
