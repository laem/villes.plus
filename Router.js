import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Ville from './Ville'
import { Classement } from './Classement'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'

let About = () => (
	<div
		css={`
			max-width: 45rem;
			margin: 0 auto;
		`}
	>
		<h1>À propos</h1>
		<p>
			Ce site présente un classement des grandes villes françaises les plus
			piétonnes.
		</p>
		<p>
			Pour celà, on récupère toutes les zones piétonnes d'une ville sur
			OpenStreetMap (le Wikipedia des cartes), puis on somme toutes leurs
			surfaces.
		</p>

		<h2>Qu'est-ce qu'une zone piétonne ?</h2>

		<p>
			Nous considérons ici que c'est une zone publique où le piéton est
			prioritaire. Par exemple, une rue piétonne, ou une rue "apaisée" où les
			voitures et autres véhicules doivent laisser la priorité aux piétons. Un
			parc urbain. Une place piétonne. Un jardin privée de résidence ou d'école
			n'en est pas une.
		</p>
		<p>
			A noter, nous considérons qu'un trottoir n'est pas une zone piétonne, car
			il est en général minoritaire en surface par rapport à la route à laquelle
			il est collé. Le piéton n'y est pas libre de circuler en largeur : à moins
			d'emprunter un passage piéton, il risque sa vie à se déplacer dans la
			plupart des rues aujourd'hui.
		</p>
		<p>
			Pour plus d'infos sur l'algorithme, explorez une des villes en cliquant
			dessus où <a href="https://github.com/laem/villes.plus">rejoignez-nous</a>{' '}
			pour le faire évoluer.
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

