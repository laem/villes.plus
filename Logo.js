import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default ({ animate, text, color, cyclable, noLink }) => {
	const blue = '#1e3799'

	const [walking, walk] = useState(animate ? false : true)
	useEffect(() => {
		setTimeout(() => walk(true), 3000)
	}, [])
	const goodEmoji = cyclable ? '🚴' : '🚶'
	const firstEmoji = cyclable ? '🚳' : '🧍'
	const human =
		Math.random() > 0.5
			? {
					walking: goodEmoji + '‍♀️',
					standing: firstEmoji + (!cyclable ? '‍♀️' : ''),
			  }
			: {
					walking: goodEmoji + '‍♂️',
					standing: firstEmoji + (!cyclable ? '‍♂️' : ''),
			  }
	const emoji = human[walking ? 'walking' : 'standing']

	const black = !walking ? '#000' : 'none',
		grey = !walking ? '#333' : '#e1e1e17a'
	return (
		<div css="a {text-decoration: none}; font-size: 200%">
			<Link to="/">
				{!animate ? (
					<span>{human.walking}</span>
				) : (
					<span
						css={`
							display: block;
							margin: 0.6rem auto 0;
							position: relative;
							background: ${black};
							width: 5rem;
							height: 4rem;
							border-radius: 0.6rem;
							border: 0.6rem solid ${grey};
							font-size: 150%;
							padding-bottom: 0.3rem;
							#bar {
								width: 2px;
								height: 100%;
								background: #aaa;
							}

							> span {
								margin-left: ${walking ? '-1.2' : '-.3'}rem;

								${walking
									? /* filter: invert(4%) grayscale(100%) brightness(50%) sepia(100%) hue-rotate(50deg) saturate(750%) contrast(2) */
									  `
						`
									: `
						filter: invert(20%) grayscale(100%) brightness(50%) sepia(100%) hue-rotate(-50deg) saturate(400%) contrast(2);
						`}
							}
						`}
					>
						<span>{emoji}</span>
						<div
							css={`
								position: absolute;
								width: 0.4rem;
								background: ${grey};
								left: 48%;
								top: 0;
								height: 100%;
							`}
						></div>
					</span>
				)}
				{text && (
					<span
						css={`
							color: ${color || blue};
						`}
					>
						{text}
					</span>
				)}
			</Link>
		</div>
	)

	//Old logo

	return (
		<div css="a {text-decoration: none}">
			<Link to="/">
				<h1
					css={`
						font-size: 250%;
						margin: 0.1rem;
						text-align: center;
						color: ${color || blue};
					`}
				>
					villes
					<span
						css={`
							background: ${color || blue};
							color: ${{ white: 'black', black: 'white', undefined: 'white' }[
								color
							]};
							border-radius: 2.5rem;
							width: 2.5rem;
							display: inline-block;
							margin-left: -0.1rem;
							line-height: 2.5rem;
						`}
					>
						+
					</span>{' '}
					<span css="font-size: 120%; margin-left: 1rem">{text}</span>
				</h1>
			</Link>
		</div>
	)
}
