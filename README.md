## L'objectif

À l'origine, ce site a vu le jour pour porter le sujet du caractère piéton des villes à l'aube des municipales des 2020 en France, faire connaitre les résultats dans la presse 🗞️ et le communiquer aux maires 🏅 et candidats.

Depuis, le site a été complété avec un classement des territoires cyclables, qui est devenu le sujet principal, l'intérêt des français pour le caractère piéton des villes étant bien plus faible.

Ce qui fait l'originalité du classement villes.plus, c'est son ouverture totale. Non seulement le code est ouvert, mais la méthode de calcul est entièrement [documentée en ligne](https://www.villes.plus/explications). Avant toute question, parcourez attentivement cette documentation.

## Techniquement

L'architecture du projet est la suivante :

- un serveur en NodeJS qui s'occupe de faire les requêtes et les calculs pour les classements, hébergé sur scalingo
- des fichiers de calcul différents pour le calcul piéton (qui comporte beaucoup d'opérations topologiques) et pour le calcul cyclable (plus simple mais pas trivial non plus)
- un serveur [BRouter](https://brouter.de) pour les calculs d'itinéraires cyclables, hébergé sur scalingo, dont le code est [ici](https://github.com/laem/brouter-standalone)
- un site Web en NextJS v13 "app router" dans le dossier web/
- un serveur de stockage de type S3 chez Scaleway qui historise les fichiers générées (plusieurs Mo pour chaque territoire) pour très peu de coût.

> Bon à savoir : sur scalingo, il est très facile de scaler les serveurs. Quand la campagne mensuelle de recalcul des classements commence, mettre 1 ou 2 machines à la taille 2XL. Quand elle est terminée, je vous conseille de les remettre à une taille S. Ça rendra les calculs rapides, sans trop de risque de dépassement de mémoire, et ça ne vous coutera pas grand chose. On peut s'attendre à un coût de ~ 500€ / an si bien géré, voir beaucoup moins.

> À vrai dire, c'est la principale difficulté de la maintenance de cette application : parfois, ça crashe. Manque de mémoire, timeout du côté de scalingo, etc. Les fonctions de fetch dans le code sont en général englobées dans un try {} catch () qui explique ce qui se passe mal, mais des fois ça reste compliqué à débugguer.

Pour mener une campagne de mise à jour, il est important de relancer les serveurs laem/brouter-standalone sur scalingo : les dernières données OSM sont téléchargées à l'initialisation du serveur via le script https://github.com/laem/brouter-standalone/blob/master/download.sh.

> Note : ce téléchargement pièce par pièce est un peu relou. Il pourrait être fait une fois pour toute, puis un gros fichier complet serait téléchargé sur chaque serveur Scalingo, périodiquement.

L'application propose aussi un mode intéractif, dit `client`, au moyen du paramètre `client=true` dans l'URL d'une page de territoire. Il permet de voir la carte cyclable se composer en temps réel, segment par segment, pratique pour débugguer et comprendre comment l'algo fonctionne :)

## Internationalisation

We'd love to make these rankings available in your country, but we don't have the dev force yet, nor money. If you have one of those, contact us at https://matrix.to/#/@maelito:matrix.org.
