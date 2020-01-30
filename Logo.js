import React from 'react'
import { Link } from 'react-router-dom'

export default ({ color, text }) => {
	const blue = '#1e3799'

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
