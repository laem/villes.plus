'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import CityResult from './CityResult'
import Logo from './Logo'
import algorithmVersion from '../../algorithmVersion'
import { ClassementWrapper, NewCityLink } from './ClassementUI'

export const normalizedScores = (data) => {
	const million = 1000 * 1000
	const pedestrianArea = data.pedestrianArea / million,
		relativeArea = data.relativeArea / million,
		area = data.geoAPI.surface / 100, // looks to be defined in the 'hectares' unit
		percentage = (pedestrianArea / relativeArea) * 100
	return { pedestrianArea, area, relativeArea, percentage }
}

export function Classement({ cyclable, data }) {
	const villes = data

	let villesEntries = Object.entries(villes)
	const [gridView, setGridView] = useState(false)

	return (
		<>
			<Logo animate cyclable={cyclable} />
			<ClassementWrapper gridView={gridView}>
				<h2>
					{cyclable
						? 'Quelles métropoles françaises sont les plus cyclables ?'
						: 'Quelles grandes villes françaises sont les plus piétonnes ?'}
				</h2>
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
					- {cyclable ? algorithmVersion : 'v1'}
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
				{
					<ol
						css={`
							${gridView
								? `
							display: flex; flex-wrap: wrap;
							padding: 0 2rem !important;
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
