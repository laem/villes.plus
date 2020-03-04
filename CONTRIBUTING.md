Ce classement des villes les plus piétonnes est complètement ouvert et contributif.

Comment aider ?

Il vous faut d'abord créer en 2 minutes ⏱ un compte [ici](https://github.com/join) sur la plateforme Github qui héberge le projet.

Vous pouvez maintenant : 

- [signaler une zone piétonne manquante](https://github.com/laem/villes.plus/issues/new?assignees=&labels=&template=faux-n-gatif.md&title=Il+manque+une+zone+pi%C3%A9tonne) 
- [signaler une zone piétonne qui n'en est pas une](https://github.com/laem/villes.plus/issues/new?assignees=&labels=&template=faux-positif.md&title=Une+zone+dite+pi%C3%A9tonne+n%27en+est+pas+une)
- [lancer une discussion à propos de ce que vous voulez](https://github.com/laem/villes.plus/issues/new)

En gros, l'algorithme du classement est le suivant : 
- récupérer les formes OpenStreetMap voulues, via la requête https://github.com/laem/villes.plus/blob/master/request.js. Il est possible de tester ce genre de requête (par exemple pour ajouter des formes, explorer s'il y en a dans telle ville) sur overpass-turbo.eu
- transformer les formes de type voie, qui sont en une dimension, en surface
- fusionner toutes les formes pour éviter de compter 2 fois les zones où elles se recoupent
- découper les formes avec le contour de la ville récupéré via l'API Géo
- (on avait commencé à exclure des formes, mais ce n'est plus d'actualité)

💻 Pour les développeurs : toute contribution au code est la bienvenue :-)


Tout est automatisé, et déployé par Scalingo à la main via `git push scalingo master`

