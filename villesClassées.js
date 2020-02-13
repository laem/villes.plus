const villes = [
	// Le critère du périphérique est pas mal du tout pour exclure les grands parcs en dehors de la ville !
	// Celui du Havre y resterait, certains de Rennes partiraient, Vinennes et Boulogne aussi, Toulouse la base aussi, Brest à voir
	// Plus compliqué pour Strasbourg...

	'Paris',
	// Pas mal de trottoirs à Paris, faut-il les inclure ? Pas celui-là :
	// https://www.openstreetmap.org/way/664721499
	// Rues piétonnes privées rue des Vignoles
	// le père lachaise doit-il être compté dans son entiereté où comme un enesemvle de chemins ?
	'Marseille',
	'Lyon',
	'Toulouse',
	// Base de la ramée
	// Retirer l'aéroport lol
	'Nantes',
	// Différence entre vert et rouge ...
	'Montpellier',
	'Strasbourg',
	'Bordeaux',
	'Lille',
	'Rennes',
	// Forme étrange sur le périf à gauche, parking
	'Reims',
	'Saint-Étienne',
	'Le Havre',
	'Toulon',
	'Grenoble',
	// Parc louche en haut à droite et à droite autour d'une rotonde
	'Dijon',
	'Angers',
	// Parc très louche en haut à gauche
	'Nîmes',
	'Villeurbanne',
	'Saint-Denis',
	'Aix-en-Provence',
	'Le Mans',
	'Clermont-Ferrand',
	'Brest'
]

export default villes
