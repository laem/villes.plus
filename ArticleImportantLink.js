import { Link } from 'react-router-dom'

export default ({ children, to }) => (
	<Link to={to} css="text-decoration: none">
		<div
			css={`
				width: 16rem;
				font-weight: bold;
				text-align: center;
				max-width: 80vw;
				background: #4117b330;
				padding: 0.4rem 1rem;
				margin: 0 auto;
			`}
		>
			{children}
		</div>
	</Link>
)
