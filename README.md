## L'objectif 

Présenter bien avant les municipales un classement des villes les plus piétonnes. Faire connaitre les résultats dans la presse 🗞️ et le communiquer aux maires 🏅 et candidats.

![](https://user-images.githubusercontent.com/1177762/69954623-05cf3080-14fc-11ea-9cef-953b5e968776.jpg)

## La méthode

On va se baser sur les magnifiques données d'Openstreetmap. 

On aura alors non pas un classement des villes piétonnes, mais un classement des villes piétonnes **et** donnant de l'importance à la publication de données de voirie libres.

Pour améliorer sa place dans le classement il faudra donc jouer sur ces deux points, ce qui me semble vertueux.

## L'algorithme version 1

- faire une requete openstreemap via l'API overpass, qui va chercher toutes les formes que l'on considère comme piétonnes et publiques dans une ville
- transformer les résultats en geojson
- transformer les rues piétonnes en polygones, avec le paramètre width si existant, sinon avec une valeur par défaut
- calculer l'aire totale des formes et la comparer à l'aire de la ville, probablement en pour mille, pas en pour cent, vu l'état déplorable de nos villes
- classer les villes françaises sur un site très simple et mobile qui explique la démarche

## Version 2

### Interface 

- présenter les résultats sous forme de carte. C'est compliqué, car les outils actuels (mapbox par exemple) cachent les détails au niveau de zoom de la ville. Or ici on voudrait visualiser une carte noir et blanc : zones piétonnes publiques vs le reste.

### Mesure 

- ajouter les rivières et plans d'eau ?
- calculer le linéaire de rues piétonnes et le comparer au linéaire de rues motorisées, faire 2 scores
- intégrer aussi les voies cyclables 🚴‍
