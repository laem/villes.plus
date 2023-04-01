import { Link } from 'react-router-dom'
import Logo from './Logo'
export default () => (
	<div
		css={`
			height: 100%;
			text-align: center;
		`}
	>
		<h1>Villes.plus</h1>
		<div
			css={`
				height: 70%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;
				a {
					margin: 1rem;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 12rem;
					text-align: center;
					span {
						font-size: 300%;
					}
					text-decoration: none;
					border: 4px solid #4117b3;
					border-radius: 0.4rem;
					padding: 0.6rem;
				}
			`}
		>
			<Link to="/cyclables">
				<span>🚲️</span> Le classement des métropoles{' '}
				<strong>les plus cyclables</strong>
			</Link>
			<Link to="/piétonnes">
				<span>🚶</span>
				Le classement des grandes villes <strong>les plus piétonnes</strong>
			</Link>
		</div>
	</div>
)
