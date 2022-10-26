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
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 12rem;
					text-align: center;
					span {
						font-size: 300%;
					}
				}
			`}
		>
			<Link to="/cyclables">
				<span>🚲️</span> Les métropoles les plus cyclables
			</Link>
			<Link to="/pietonnes">
				<span>🚶</span>
				Les villes les plus piétonnes
			</Link>
		</div>
	</div>
)
