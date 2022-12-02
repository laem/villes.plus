import React from 'react'
import { Link } from 'react-router-dom'

export default ({ ville, cyclable, data, i }) => (
	<li key={ville}>
		<Link to={encodeURI((cyclable ? '/cyclables/' : '/pietonnes/') + ville)}>
			<span css="width: 1.5rem; text-align: center">
				{i > 2 ? i + 1 : { 0: '🥇', 1: '🥈', 2: '🥉' }[i]}&nbsp;
			</span>

			<div
				css={`
					width: ${cyclable ? '21rem' : '8rem'};
				`}
			>
				{ville}
			</div>
			<div css="width: 4rem;text-align: center">
				<span css="font-weight: 600">
					{cyclable
						? data && data.score
						: data.percentage < 0
						? '⏳️'
						: data.percentage.toFixed(0)}
				</span>
				<small> %</small>
			</div>
			{!cyclable && (
				<div css="width: 8rem; text-align: left">
					{data.pedestrianArea && data.relativeArea && (
						<span css="font-size: 80%; color: #1e3799">
							{data.pedestrianArea.toFixed(1)} sur{' '}
							{data.relativeArea.toFixed(1)} km²
						</span>
					)}

					{/* 			{data.meanStreetWidth +
													' | ' +
													data.streetsWithWidthCount}
										*/}
				</div>
			)}
		</Link>
	</li>
)
