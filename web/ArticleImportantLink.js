'use client'
import Link from 'next/link'

export default ({ children, to }) => (
	<Link
		href={to}
		css={`
			text-decoration: none;
			color: white;
			font-weight: bold;
			font-size: 150%;
			text-align: center;
			margin: 3rem 0;
			display: block;
		`}
	>
		<div
			css={`
				width: 25rem;
				max-width: 80%:
				text-align: center;
				max-width: 80vw;
				background: var(--color1);
				padding: 1rem;
				margin: 0 auto;
			`}
		>
			{children}
		</div>
	</Link>
)
