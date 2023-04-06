'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import getCityData, { toThumb } from './wikidata'
import villesList from '../villesClassées'
import Image from 'next/image'

const métropoleToVille = villesList.reduce(
	(memo, next) =>
		typeof next === 'string'
			? { ...memo, [next]: next }
			: { ...memo, [next[1]]: next[0] },
	{}
)

export default ({ ville, cyclable, data, i, gridView }) => {
	const [wikidata, setWikidata] = useState()

	useEffect(() => {
		if (wikidata) return
		getCityData(cyclable ? métropoleToVille[ville] : ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [wikidata])

	const imageURL = wikidata?.pic.value && toThumb(wikidata.pic.value)
	const medal = i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]
	console.log('D', data)

	return (
		<li
			key={ville}
			css={`
				> a {
					display: flex;
					flex-direction: column;
				}
			`}
		>
			<Link
				href={encodeURI((cyclable ? '/cyclables/' : '/pietonnes/') + ville)}
			>
				<h3
					css={`
						font-weight: bold;
						font-size: 130%;
						@media (min-width: 800px) {
							font-size: 160%;
						}
						margin: 0.4rem 0;
						${gridView &&
						`
						white-space: nowrap;
						max-width: 20rem;
						overflow: scroll;`}
					`}
				>
					<span
						css={`
							width: 3rem;
							text-align: center;
						`}
					>
						{medal}&nbsp;
					</span>
					{ville}
				</h3>
				<div
					css={`
						display: flex;
						justify-content: start;
						align-items: center;
					`}
				>
					{imageURL && (
						<div
							css={`
								width: 75%;
								height: 8rem;
								@media (min-width: 800px) {
									height: 12rem;
								}
								img {
									border-radius: 1rem;
								}
								position: relative;
							`}
						>
							<Image
								src={imageURL}
								style={{ objectFit: 'cover' }}
								fill={true}
								alt={'Une photo emblématique de la ville de ' + ville}
							/>
						</div>
					)}

					<div
						css={`
							text-align: center;
							font-size: 170%;
							margin-left: 1rem;

							@media (min-width: 800px) {
								font-size: 260%;
								margin-left: 2rem;
							}
							display: flex;
							flex-direction: column;
						`}
					>
						<div>
							<span
								css={`
									font-weight: 600;
								`}
							>
								{cyclable
									? data && Math.round(data.score)
									: data.percentage < 0
									? '⏳️'
									: data.percentage.toFixed(0)}
							</span>
							<small> %</small>
						</div>
						{!cyclable && (
							<div
								css={`
									width: 8rem;
									text-align: left;
									font-size: 60%;
								`}
							>
								{data.pedestrianArea && data.relativeArea && (
									<span
										css={`
											font-size: 80%;
											color: #1e3799;
										`}
									>
										{data.pedestrianArea.toFixed(1)} sur{' '}
										{data.relativeArea.toFixed(1)}&nbsp;km²
									</span>
								)}

								{/* 			{data.meanStreetWidth +
													' | ' +
													data.streetsWithWidthCount}
										*/}
							</div>
						)}
					</div>
				</div>
			</Link>
		</li>
	)
}
