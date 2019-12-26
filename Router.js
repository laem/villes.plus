import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Ville from './Ville'
import { Classement } from './Classement'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'

let About = () => (
	<div>
		<h1>À propos</h1>
		<p>
			On explique ici pourquoi ce site. C'est important d'expliquer pourquoi
		</p>
	</div>
)

export default function App() {
	return (
		<Router>
			<div
				css={`
					height: 100%;
					display: flex;
					flex-direction: column;
				`}
			>
				<div css="flex-grow: 1; > a {text-decoration: none}">
					<Link to="/">
						<h1
							css={`
								font-size: 250%;
								margin: 0.1rem;
								text-align: center;
								color: #1e3799;
							`}
						>
							villes
							<span
								css={`
									background: #1e3799;
									color: white;
									border-radius: 2.5rem;
									width: 2.5rem;
									display: inline-block;
									margin-left: -0.1rem;
									line-height: 2.5rem;
								`}
							>
								+
							</span>
						</h1>
					</Link>
					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
					<Switch>
						<Route path="/à-propos" component={About} />
						<Route path="/:ville" component={Ville} />
						<Route path="/" component={Classement} />
					</Switch>
				</div>
				<Nav />
			</div>
		</Router>
	)
}
