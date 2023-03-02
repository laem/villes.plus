import React, { useEffect, useState } from 'react'
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from 'react-router-dom'
import { Classement } from './Classement'
import Cyclable from './Cyclable'
import Explications from './Explications'
import ExplicationsCyclables from './ExplicationsCyclables.mdx'

import fetchExceptions from './fetchExceptions'
import { Nav } from './Nav'
import Ville from './Ville'
import Landing from './Landing'
import styled from 'styled-components'

export default function App() {
	let [exceptions, setExceptions] = useState({})

	useEffect(() => {
		fetchExceptions().then((json) => setExceptions(json))
	}, [])

	console.log({ exceptions })

	const toggleException = (ville, id) => {
		const list = exceptions[ville] || []

		setExceptions({
			...exceptions,
			[ville]: list.includes(id) ? list.filter((e) => e !== id) : [...list, id],
		})
	}
	return (
		<Router>
			<div
				css={`
					height: 100%;
					display: flex;
					flex-direction: column;
					font-size: 110%;
				`}
			>
				<div css="flex-grow: 1; > a {text-decoration: none}">
					<Routes>
						<Route
							path={`/${encodeURIComponent(`pietonnes`)}`}
							element={<Classement />}
						/>
						<Route path="/cyclables" element={<Classement cyclable />} />
						<Route path="/cyclables/:ville" element={<Cyclable />} />
						<Route path="/explications" element={<Explications />} />
						<Route
							path="/explications/cyclables"
							element={
								<Article>
									<ExplicationsCyclables />
								</Article>
							}
						/>
						<Route
							path={`/${encodeURIComponent(`pietonnes`)}/:ville`}
							element={<Ville {...{ exceptions, toggleException }} />}
						/>
						<Route path="/" element={<Landing />} />
					</Routes>
				</div>
				<Nav />
			</div>
		</Router>
	)
}

const Article = styled.article`
	max-width: 700px;
	margin: 0 auto;
	padding: 0 0.6rem;
	h1 {
		font-size: 160%;
	}
	h2 {
		font-size: 140%;
	}
	img {
		width: 700px;
		max-width: 90vw;
	}
`
