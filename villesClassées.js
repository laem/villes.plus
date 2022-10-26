const villes = [
	// Le critère du périphérique est pas mal du tout pour exclure les grands parcs en dehors de la ville !
	// Celui du Havre y resterait, certains de Rennes partiraient, Vinennes et Boulogne aussi, Toulouse la base aussi, Brest à voir
	// Plus compliqué pour Strasbourg...

	//	['Paris', 'Métropole du Grand Paris'],
	// Pas mal de trottoirs à Paris, faut-il les inclure ? Pas celui-là :
	// https://www.openstreetmap.org/way/664721499
	// Rues piétonnes privées rue des Vignoles
	// le père lachaise doit-il être compté dans son entiereté où comme un enesemvle de chemins ?
	['Marseille', 'Aix-Marseille-Provence'],
	['Lyon', 'Métropole de Lyon'],
	['Toulouse', 'Toulouse Métropole'],
	['Nice', "Nice Côte d'Azur"],
	// Base de la ramée
	// Retirer l'aéroport lol
	['Nantes', 'Nantes Métropole'],
	// Différence entre vert et rouge ...
	['Montpellier', 'Montpellier Méditerranée Métropole'],
	['Strasbourg', 'Strasbourg Eurométropole'],
	['Bordeaux', 'Bordeaux Métropole'],
	['Nancy', 'Métropole du Grand Nancy'],
	['Metz', 'Metz Métropole'],
	['Rouen', 'Métropole Rouen Normandie'],
	['Lille', 'Métropole Européenne de Lille'],
	['Rennes', 'Rennes Métropole'],
	['Orléans', 'Orléans Métropole'],
	// Forme étrange sur le périf à gauche, parking
	'Reims',
	['Saint-Étienne', 'Saint-Étienne Métropole'],
	'Le Havre',
	['Tours', 'Tours Métropole Val de Loire'],
	'Toulon',
	['Grenoble', 'Grenoble-Alpes Métropole'],
	// Parc louche en haut à droite et à droite autour d'une rotonde
	'Dijon',
	'Angers',
	// Parc très louche en haut à gauche
	'Nîmes',
	'Villeurbanne',
	//	'Saint-Denis', // On a un pb avec cette ville, incroyablement étendue
	'Aix-en-Provence',
	'Le Mans',
	['Clermont-Ferrand', 'Clermont Auvergne Métropole'],
	['Brest', 'Brest Métropole'],
]

export default villes
