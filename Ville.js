import React, { useState, useEffect } from 'react'
import { compute } from './allez'
import localforage from 'localforage'

export default ({ match: { params } }) => {
	let ville = params.ville
	let [data, setData] = useState(null)
	useEffect(() => {
		localforage.getItem(ville).then(value => {
			if (!value) {
				compute(ville, data => {
					localforage.setItem(ville, data)
					setData(data)
				})
			}
			setData(value)
		})
	}, [])

	return (
		<div>
			<h1>{params.ville}</h1>
			<pre>
				{data &&
					JSON.stringify(
						{ ...data, geojson: data.geojson.features.length },
						null,
						'\t'
					)}
			</pre>
			Bientôt une carte
			<button onClick={() => localforage.clear()}>Vider la mémoire</button>
		</div>
	)
}
