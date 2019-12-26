import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Ville from './Ville'
import { Classement } from './Classement'
import { Nav } from './Nav'

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
			<div>
				<Nav />
				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Switch>
					<Route path="/:ville" component={Ville} />
					<Route path="/à-propos" component={About} />
					<Route path="/" component={Classement} />
				</Switch>
			</div>
		</Router>
	)
}
