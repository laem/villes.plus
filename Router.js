import React, { useState, useEffect } from 'react'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'
import Ville from './Ville'
import { Classement } from './Classement'
import { Nav } from './Nav'
import Explications from './Explications'
import fetchExceptions from './fetchExceptions'

export default function App() {
	let [exceptions, setExceptions] = useState({})

	useEffect(() => {
		fetchExceptions().then(json => setExceptions(json))
	}, [])

	console.log({ exceptions })

	const toggleException = (ville, id) => {
		const list = exceptions[ville] || []

		setExceptions({
			...exceptions,
			[ville]: list.includes(id) ? list.filter(e => e !== id) : [...list, id]
		})
	}
	return (
		<Router>
			<div
				css={`
					height: 100%;
					display: flex;
					flex-direction: column;
					font-size: 110%;
				`}
			>
				<div css="flex-grow: 1; > a {text-decoration: none}">
					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
					<Switch>
						<Route path="/piétonnes" component={Classement} />
						<Route path="/explications" component={Explications} />
						<Route path="/:ville">
							<Ville {...{ exceptions, toggleException }} />
						</Route>
						<Route path="/">
							<Redirect to="/piétonnes" />
						</Route>
					</Switch>
				</div>
				<Nav />
			</div>
		</Router>
	)
}
