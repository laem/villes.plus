import React from 'react'
import { Link } from 'react-router-dom'
export function Nav() {
	return (
		<nav>
			<h1
				css={`
					font-size: 250%;
					margin: 0.1rem;
					text-align: center;
				`}
			>
				villes+
			</h1>
			<ul
				css={`
					display: flex;
					justify-content: center;
					padding-left: 0;
					li {
						margin: 0 1rem;
						list-style-type: none;
					}
				`}
			>
				<li>
					<Link to="/à-propos">À propos</Link>
				</li>
				<li>
					<a href="https://github.com/laem/pietonnes">Code source</a>
				</li>
			</ul>
		</nav>
	)
}
