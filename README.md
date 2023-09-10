## L'objectif

À l'origine, ce site a vu le jour pour porter le sujet du caractère piéton des villes à l'aube des municipales des 2020 en France, faire connaitre les résultats dans la presse 🗞️ et le communiquer aux maires 🏅 et candidats.

Depuis, le site a été complété avec un classement des territoires cyclables, qui est devenu le sujet principal, l'intérêt des français pour le caractère piéton des villes étant bien plus faible.

Ce qui fait l'originalité du classement villes.plus, c'est son ouverture totale. Non seulement le code est ouvert, mais la méthode de calcul est entièrement [documentée en ligne](https://www.villes.plus/explications). Avant toute question, parcourez attentivement cette documentation.

## Techniquement

L'architecture du projet est la suivante :

- un serveur en NodeJS qui s'occupe de faire les requêtes et les calculs pour les classements, hébergé sur scalingo
- des fichiers de calcul différents pour le calcul piéton (qui comporte beaucoup d'opérations topologiques) et pour le calcul cyclable (plus simple mais pas trivial non plus)
- un serveur [BRouter](https://brouter.de) pour les calculs d'itinéraires cyclables, hébergé sur scalingo
- un site Web en NextJS v13 "app router" dans le dossier web/
- un serveur de stockage de type S3 chez Scaleway qui historise les fichiers générées (plusieurs Mo pour chaque territoire) pour très peu de coût.

> Bon à savoir : sur scalingo, il est très facile de scaler les serveurs. Quand la campagne mensuelle de recalcul des classements commence, mettre 1 ou 2 machines à la taille 2XL. Quand elle est terminée, je vous conseille de les remettre à une taille S. Ça rendra les calculs rapides, sans trop de risque de dépassement de mémoire, et ça ne vous coutera pas grand chose.
