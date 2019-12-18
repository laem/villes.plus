import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Ville from './Ville'

export default function App() {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/Paris">Paris</Link>
						</li>
						<li>
							<Link to="/Brest">Brest</Link>
						</li>
						<li>
							<Link to="/classement">Classement</Link>
						</li>
					</ul>
				</nav>

				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Switch>
					<Route path="/classement">
						<Classement />
					</Route>
					<Route path="/:ville" component={Ville} />
					<Route path="/">
						<Accueil />
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

function Classement() {
	return <h2>Classement</h2>
}

const Accueil = () => <h1>Les villes les plus piétonnes</h1>

