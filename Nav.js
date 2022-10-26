import React from 'react'
import { Link } from 'react-router-dom'
export function Nav() {
	return (
		<nav
			css={`
				flex-shrink: 0;
				background: linear-gradient(#1e3799, #1e3799cc);
				a {
					color: white;
					text-decoration: none;
					font-weight: 600;
				}
			`}
		>
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
					<Link to="/explications">Explications</Link>
				</li>
				<li>
					<a href="https://github.com/laem/villes.plus">Code source</a>
				</li>
			</ul>
		</nav>
	)
}
