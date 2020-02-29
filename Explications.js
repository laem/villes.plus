import React from 'react'

export default () => (
	<div
		css={`
			margin-top: 2rem;
			max-width: 45rem;
			margin: 0 auto;
			padding: 0 1rem;
		`}
	>
		<h1>📖 Explications</h1>
		<p>
			Nos villes se transforment. Un critère intéressant est la place donnée aux
			piétons. Voici{' '}
			<strong>
				le premier classement libre des grandes villes françaises les plus
				piétonnes
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

		<h2>Qu'est-ce qu'une zone piétonne ? </h2>
		<p>
			C'est une zone publique où le piéton est prioritaire. Une rue ou une place
			où l'on peut marcher librement et sans danger. Un chemin dans un parc
			urbain, dans une forêt urbaine ou au bord d'une rivière, une plage.
		</p>
		<h2>Les parcs sont-ils inclus ?</h2>
		<p>
			Seules les zones piétonnes des parcs et squares sont prises en compte. En
			effet, dans un parc comme celui de Vincennes, à l'est de Paris, une part
			importante de la surface est urbanisée (salle de sport, grand restaurant
			privé, etc.). On y trouve de nombreux bois et zones plantées, qui ne sont
			pas destinés à la marche.
		</p>
		<p>
			Une prochaine version du classement proposera un deuxième score pour
			récompenser les villes qui se dotent d'une grande surface d'espaces verts.
			La tâche n'est pas simple cependant, car certaines villes intègrent dans
			leur juridiction de grands espaces extra-urbains comme le bois de
			Vincennes à Paris, le parc de la Combe à la Serpent à Dijon, l'Arche de la
			Nature au Mans.
		</p>
		<h2>Et les trottoirs ?</h2>
		<p>
			Un trottoir est une bande piétonne adossée à une rue dédiée aux voitures.
			Sa surélévation matérialise le danger de la route qu'il borde. Le piéton
			ne peut s'y balader librement, contraint d'emprunter des passages peints
			au sol, en attendant un signal lumineux ou en s'assurant qu'un bolide de
			plusieurs centaines de kilos ne fonce pas pour le traverser en même temps
			que lui.
		</p>
		<p>Trottoirs et passages piétons sont donc exclus du classement.</p>
		<p>
			Notons qu'il existe des voies piétonnes assez larges ou suffisemment
			séparées de la route pour ne plus être appelés trottoirs. La limite reste
			floue cependant, et certains trottoirs sont catégorisés comme chemins et
			manquent l'attribut trottoir, n'hésitez pas à corriger la donnée sur
			OpenStreetMap, c'est un jeu d'enfant.
		</p>
		<h2>[Ma ville] est une ville super piétonne, pourquoi ce score ?</h2>
		<p>
			Nous gardons souvent en mémoire le centre-ville touristique, souvent
			rempli d'histoire et apaisé, plutôt que le reste de la ville, la plupart
			du temps bien plus hostile aux piétons.
		</p>
		<p>
			N'hésitez pas à proposer des idées de classements complémentaires, par
			exemple des cercles de 5km autour du coeur des villes.
		</p>
		<h2>Pourquoi classer les communes, et pas la métropôle ?</h2>
		<p>
			Dans une zone comme l'Île de France, difficile en effet de séparer Paris
			de sa petite couronne, étant donné la continuité urbaine.{' '}
		</p>
		<p>
			Mais les communes sont l'échelle la plus simple pour agir : il suffit que
			les citoyens votent en mars 2020 pour une ville plus piétonne et que le ou
			la maire s'en saisisse pour que le score s'améliore. Piétonniser une rue
			de quartier peu passante, transformer des carrefours en zones appaisées,
			ou encore supprimer une voie d'un boulevard pour la donner aux piétons,
			sont des moyens peu coûteux 💸 pour gagner de précieux pourcentages.
		</p>
		<h2>
			Pourquoi mesurer la surface piétonne plutôt que le nombre de kilomètres ?
		</h2>
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
			est triste que nos villes, à l'exception des vieux centres, soient trop
			désagréables pour qu'on s'y balade ainsi.
		</p>
		<p>
			Deuxièmement, même si toutes les rues de nos villes permettent
			techniquement de se déplacer, ce n'est pas forcément une expérience
			agréable. Illustration : le canal Saint-Martin à Paris du point de vue
			seul de l'itinéraire n'est pas plus efficace pour un piéton le dimanche
			(où il est entièrement piéton) que les autres jours. Par contre, la
			surface piétonne y est 10x plus grande le dimanche, et l'expérience en
			conséquence beaucoup plus plaisante, à tel point qu'on peut y voir, chose
			exceptionnelle à Paris, des enfants jouer dans la rue !
		</p>
		<h2>Le classement est-il exhaustif ?</h2>
		<p>
			Ce classement repose sur les magnifiques cartes libres d'
			<a href="https://openstreetmap.org">OpenStreetMap</a>, le Wikipedia des
			cartes. En France, elles sont remarquablement complètes, mais évidemment
			pas parfaites.
		</p>
		<p>
			Notons par exemple que les rues ne sont en général tracées comme des
			segments, pas comme des surfaces. Nous estimons donc leur surface, soit
			avec la largeur qui a été spécifiée comme attribut, soit par convention à
			5m. Ce paramètre empirique désavantage une ville qui aurait des rues bien
			plus larges qu'une autre, mais nous n'avons aujourd'hui pas mieux.
		</p>
		<p>
			Il y a deux façons d'améliorer le classement d'une ville :
			<ol>
				<li>
					améliorer les données en
					<a href="https://www.openstreetmap.fr/contribuer/">
						contribuant à OpenStreetMap
					</a>
					. C'est facile, que l'on soit un citoyen ou une administration.
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
		<h2>Est-il souhaitable de supprimer complètement les voitures 🚗 ?</h2>
		<p>
			Non bien sûr ! Le but de ce classement est de récompenser les villes qui
			donnent la priorité aux piétons, ce que ne veut pas dire supprimer les
			routes. Certaines personnes ont clairement besoin d'une voiture, les
			livraisons des magasins sont plus pratiques en camion et les urgences
			doivent pouvoir intervenir rapidement. Ça tombe bien, ces déplacements
			sont largement facilités dans les villes où le trafic est fortement
			réduit.
		</p>
		<p>
			<a href="https://www.youtube.com/watch?v=GlXNVnftaNs">Cette vidéo </a>
			illustre le concept hollandais d'<em>Autoluw</em>. Ce sont des zones où
			les voitures sont complètement en retrait par rapport aux piétons et
			vélos. Il est toujours possible, et beaucoup plus efficace, d'y circuler
			en voiture quand on en a vraiment besoin.
		</p>
	</div>
)
