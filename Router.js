import React from 'react'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import styled from 'styled-components'
import { Classement } from './Classement'
import Recherche from './Recherche'
import Cyclable from './Cyclable'
import Explications from './Explications'
import ExplicationsCyclables from './ExplicationsCyclables.mdx'
import ExplicationsPiétonnes from './ExplicationsPiétonnes.mdx'
import MethodeCyclable from './MéthodeCyclable.mdx'
import Landing from './Landing'
import { Nav } from './Nav'
import Ville from './Ville'
import Article from './Article'

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
								<Route path="/piétonnes" element={<Classement />} />
								<Route path="/recherche" element={<Recherche />} />
								<Route path={'pietonnes'} element={<Classement />} />
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
									path="/explications/*"
									element={
										<Article>
											<Explications />
										</Article>
									}
								/>
								<Route path={'/pietonnes/:ville'} element={<Ville />} />
								<Route path="/piétonnes/:ville" element={<Ville />} />
							</Route>
						)
					)}
				></RouterProvider>
			</div>
		</div>
	)
}
