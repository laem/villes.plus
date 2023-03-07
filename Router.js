import React from 'react'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import styled from 'styled-components'
import { Classement } from './Classement'
import Cyclable from './Cyclable'
import Explications from './Explications'
import ExplicationsCyclables from './ExplicationsCyclables.mdx'
import ExplicationsPiétonnes from './ExplicationsPiétonnes.mdx'
import MethodeCyclable from './MéthodeCyclable.mdx'
import Landing from './Landing'
import { Nav } from './Nav'
import Ville from './Ville'

export default function App() {
	return (
		<div
			css={`
				height: 100%;
				display: flex;
				flex-direction: column;
				font-size: 110%;
			`}
		>
			<div css="flex-grow: 1; > a {text-decoration: none}">
				<RouterProvider
					router={createBrowserRouter(
						createRoutesFromElements(
							<Route element={<Nav />}>
								<Route path="/" element={<Landing />} />
								<Route
									path={`/${encodeURIComponent(`piétonnes`)}`}
									element={<Classement />}
								/>
								<Route
									path={`/${encodeURIComponent(`pietonnes`)}`}
									element={<Classement />}
								/>
								<Route path="/cyclables" element={<Classement cyclable />} />
								<Route path="/cyclables/:ville" element={<Cyclable />} />
								<Route
									path="/explications"
									element={
										<Article>
											<Explications />
										</Article>
									}
								/>
								<Route
									path="/explications/piétonnes"
									element={
										<Article>
											<ExplicationsPiétonnes />
										</Article>
									}
								/>
								<Route
									path="/explications/cyclables/méthode"
									element={
										<Article>
											<MethodeCyclable />
										</Article>
									}
								/>
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
									element={<Ville />}
								/>
								<Route
									path={`/${encodeURIComponent(`piétonnes`)}/:ville`}
									element={<Ville />}
								/>
							</Route>
						)
					)}
				></RouterProvider>
			</div>
		</div>
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
	blockquote {
		margin-left: 0;
		padding-left: 1.4rem;
		border-left: 6px solid #4117b330;
	}
`
