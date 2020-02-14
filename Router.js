import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Ville from './Ville'
import { Classement } from './Classement'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'
import About from './About'

export default function App() {
	let [exceptions, setExceptions] = useState({})

	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/laem/villes.plus/master/exceptions.json'
		)
			.then(res => res.json())
			.then(json => setExceptions(json))
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
				`}
			>
				<div css="flex-grow: 1; > a {text-decoration: none}">
					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
					<Switch>
						<Route path="/à-propos" component={About} />
						<Route path="/:ville">
							<Ville {...{ exceptions, toggleException }} />
						</Route>
						<Route path="/" component={Classement} />
					</Switch>
				</div>
				<Nav />
			</div>
		</Router>
	)
}
