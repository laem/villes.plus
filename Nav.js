import React from 'react'
import { Link } from 'react-router-dom'
export function Nav() {
	return (
		<nav>
			<ul
				css={`
					background: green;
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
