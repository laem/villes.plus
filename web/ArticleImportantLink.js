'use client'
import Link from 'next/link'

export default ({ children, to }) => (
	<Link
		href={to}
		css={`
			text-decoration: none;
		`}
	>
		<div
			css={`
				width: 16rem;
				font-weight: bold;
				text-align: center;
				max-width: 80vw;
				background: var(--color1);
				padding: 0.4rem 1rem;
				margin: 0 auto;
			`}
		>
			{children}
		</div>
	</Link>
)
