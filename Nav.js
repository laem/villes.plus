import React from 'react'
import { Link } from 'react-router-dom'
export function Nav() {
	return (
		<nav
			css={`
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				background: linear-gradient(#1e3799, #1e3799cc);
				a {
					color: white;
					text-decoration: none;
					font-weight: 600;
				}
				padding: 0.6rem;
			`}
		>
			<ul
				css={`
					margin: 0rem;
					margin-bottom: 1rem;
					display: flex;
					justify-content: center;
					padding-left: 0;
					font-size: 120%;
					align-items: center;
					li {
						margin: 0 1rem;
						list-style-type: none;
					}
				`}
			>
				<li>
					<Link to="/">
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/3/34/Home-icon.svg"
							width="10px"
							height="10px"
							css={`
								width: 1.2rem;
								height: auto;
								filter: invert(1);
							`}
						/>
					</Link>
				</li>
				<li>
					<Link to="/explications">Explications</Link>
				</li>
				<li>
					<a
						href="https://github.com/laem/villes.plus"
						title="Le code source sur Github"
					>
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
							width="10px"
							height="10px"
							css={`
								width: 1.2rem;
								height: auto;
								filter: invert(1);
							`}
						/>
					</a>
				</li>
			</ul>
			<div css="font-size: 80%; color: white; font-style: italic">
				Fait avec 💙 à Rennes par <a href="https://kont.me">Maël THOMAS</a>
			</div>
		</nav>
	)
}
