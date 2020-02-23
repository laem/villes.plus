import React from 'react'

export default () => (
	<div
		css={`
			margin-top: 2rem;
			p {
				font-size: 85%;
			}
			.badge {
				background: #1e3799;
				padding: 0 0.3rem;
				color: white;
				border-radius: 0.3rem;
				margin: 0 0.1rem;
			}
		`}
	>
		<h1>📖 Explications</h1>
		<p>
			Les villes se transforment. Un des critères à surveiller est la place
			donnée aux piétons. Nous présentons{' '}
			<strong>
				le premier classement libre et contributif des grandes villes françaises
				les plus piétonnes
			</strong>
			.
		</p>
		<p>
			Tout est développé publiquement et chacun peut y contribuer, relever des
			erreurs et questionner la méthode :{' '}
			<a href="https://github.com/laem/villes.plus/blob/master/CONTRIBUTING.md">
				rendez-vous ici
			</a>
			.
		</p>
		<h2>Qu'est-ce qu'une zone piétonne ? </h2>
		<p>
			C'est une zone accessible à tous et toutes où le piéton est prioritaire.
			Une rue ou place où l'on peut marcher librement et sans danger. Un parc
			urbain, un chemin de forêt urbaine ou de bord de rivière, une plage.
		</p>
		<h2>Les parcs sont-ils inclus ?</h2>
		<p>
			Les parcs et squares sont pris en compte tant qu'ils sont <em>dans</em> la
			ville. Ils sont considérés "extra-urbains" et ne sont donc pas comptés
			s'ils ne sont rattachés à un quartier d'habitation de la ville que sur
			moins de la moitié de leur contour, ou qu'ils sont physiquement coupés de
			la ville par un périphérique.
		</p>
		<p>
			Les parcs extra-urbains sont exclus à la main. Ajoutez '?debug' à
			l'adresse de la page d'une ville pour visualiser les choix qui ont été
			faits, par exemple pour{' '}
			<a href="https://villes.plus/Paris?debug">Paris</a>.
		</p>
		<p>
			Une prochaine version du classement proposera un deuxième score pour
			récompenser les villes qui construisent et entretiennent de grands parcs
			extra-urbains comme le bois de Vincennes à Paris, le parc de la Combe à la
			Serpent à Dijon, l'Arche de la Nature au Mans.
		</p>
		<p>
			Ceci n'est pas une science exacte, et si vous n'êtes pas d'accord avec ces
			choix,{' '}
			<a href="https://github.com/laem/villes.plus/blob/master/CONTRIBUTING.md">
				faîtes-vous entendre !
			</a>
		</p>
		<h2>Et les trottoirs ?</h2>
		<p>
			Les trottoirs sont des bandes piétonnes adossées à une rue dédiée aux
			voitures. Leur surélévation matérialise le danger de la route qu'ils
			bordent. Le piéton ne peut s'y balader librement, contraint d'emprunter
			des passages peints au sol, en attendant un signal lumineux ou en
			s'assurant qu'un bolide de plusieurs centaines de kilos ne fonce pas pour
			le traverser en même temps que lui.
		</p>
		<p>Trottoirs et passages piétons sont donc exclus du classement.</p>
		<p>
			Notons qu'il existe des voies piétonnes assez larges ou suffisemment
			séparées de la route pour ne plus être appelés trottoirs.
		</p>
		<h2>Bordeaux est une ville super piétonne, pourquoi ce score ?</h2>
		<p>
			Nous gardons souvent en mémoire le centre-ville touristique, souvent
			rempli d'histoire et apaisé, plutôt que le reste de la ville, la plupart
			du temps bien plus hostile aux piétons.
		</p>
		<p>
			N'hésitez pas à proposer un autre classement, par exemple des cercles de
			3km autour du centre des villes.
		</p>
		<h2>Pourquoi classer les communes, et pas de la métropôle ?</h2>
		<p>
			Dans une zone comme l'Île de France, difficile en effet de séparer Paris
			de sa petite couronne, étant donné la continuité urbaine.{' '}
		</p>
		<p>
			Mais les communes sont l'échelle la plus simple pour agir, il suffit que
			les citoyens votent en mars 2020 et que le ou la maire s'en saisisse pour
			que le score s'améliore.
		</p>
		<h2>Pourquoi mettre dans le même panier rues et parcs ?</h2>
		<p>
			Il est vrai que les déplacements à pied se font souvent d'un point A à un
			point B. Est-il légitime de mettre au même niveau une rue piétonne qui
			permet de traverser un quartier et un parc dans lequel on tourne en rond ?{' '}
			Nous pensons que oui.
		</p>
		<p>
			D'abord pour éviter une vision purement utilitaire de la marche, qui
			exclut donc le fait de marcher juste pour marcher. Voir à ce propos{' '}
			<a href="https://www.franceculture.fr/emissions/la-vie-interieure/la-marche">
				cette excellente baladodiffusion
			</a>{' '}
			(décidément) de 4 minutes sur la marche "autotélique". Nous jugeons qu'il
			est triste que nos villes (excepté les vieux centres très piétons) soient
			trop désagréables pour qu'on s'y balade ainsi.
		</p>
		<p>
			Deuxièmement, même si toutes les rues de nos villes permettent
			techniquement de se déplacer, ce n'est pas forcément une expérience
			agréable. Illustration : le canal Saint-Martin à Paris du point de vue
			seul de l'itinéraire n'est pas plus efficace pour un piéton le dimanche
			(où il est entièrement piéton) que les autres jours. Par contre, la
			surface piétonne y est 10x plus grande le dimanche, et l'expérience est
			beaucou plus plaisante, à tel point qu'on voit à Paris, chose
			exceptionnelle, des enfants dans les rues !
		</p>
		<p>
			Finalement, nous voulons envoyer un message clair plutôt que de multiplier
			les classements.
		</p>
		<h2>Le classement est-il exhaustif ?</h2>
		<p>
			Ce classement repose sur les magnifiques cartes libres d'
			<a href="https://openstreetmap.org">OpenStreetMap</a>. En France, elles
			sont remarquablement complètes, mais il manque évidemment plein
			d'éléments.{' '}
		</p>
		<p>
			Notons que les rues ne sont en général tracées comme des segments, pas
			comme des surfaces. Nous estimons donc leur surface, soit avec la largeur
			spécifiée comme attribut, soit par convention à 5m. Ce paramètre empirique
			désavantage une ville qui aurait des rues bien plus larges qu'une autre,
			mais nous n'avons aujourd'hui pas mieux.
		</p>
		<p>
			Il y a donc deux façons d'améliorer le classement d'une ville :
			<ol>
				<li>
					améliorer les données en
					<a href="https://www.openstreetmap.fr/contribuer/">
						contribuant à OpenStreetMap
					</a>
				</li>
				<li>piétonniser la ville </li>
			</ol>
		</p>
		<p>
			Ce dernier point peut être fait très rapidement et avec peu
			d'investissements, par exemple en créant des rues apaisées où le piéton a
			la priorité, ou en transformant des voies et places de parking en pistes
			cyclables et trottoirs et larges bandes piétonnes.
		</p>
		<p>
			Le classement est rafraîchi automatiquement tous les jours environ sur les
			dernières données en date.
		</p>
	</div>
)
