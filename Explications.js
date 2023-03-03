import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
	<div>
		<h1>📖 Explications</h1>
		<p>
			Nos villes se transforment. Deux critères s'imposent comment fondamentaux
			: la place donnée aux piétons, et celle donnée aux vélos. Voici{' '}
			<strong>
				le premier classement libre des grandes villes françaises les plus
				piétonnes et cyclables
			</strong>
			.
		</p>
		<p>
			Libre ? Tout le code est ouvert et chacun peut y contribuer, relever des
			erreurs et questionner la méthode :{' '}
			<a href="https://github.com/laem/villes.plus/blob/master/CONTRIBUTING.md">
				rendez-vous ici
			</a>
			.
		</p>
		<p>
			Tout classement de ce type est bien sûr contestable, mais nous en avons
			maintenant au moins un 🙂.
		</p>
		<h2>Explications pour le classement des villes cyclables</h2>
		C'est par ici pour{' '}
		<Link to="/explications/cyclables">
			comprendre la méthode de classement des territoires cyclables.
		</Link>
		<h2>Explications pour le classement des villes piétonnes</h2>
		C'est par ici pour{' '}
		<Link to="/explications/piétonnes">
			comprendre la méthode de classement des territoires cyclables.
		</Link>
		<h2>Qui développe ce classement ? </h2>
		<p>
			<a href="https://boitam.eu/@maeool">Maël THOMAS</a>. Tout le code{' '}
			<a href="https://github.com/laem/villes.plus/">
				est libre, venez contribuer
			</a>
			.
		</p>
	</div>
)
