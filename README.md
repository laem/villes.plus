## L'objectif 

Présenter bien avant les municipales un classement des villes les plus piétonnes. Faire connaitre les résultats dans la presse et le communiquer aux maires et candidats.

## La méthode

On va se baser sur les magnifiques données d'Openstreetmap. 
On aura alors non pas un classement des villes piétonnes, mais un classement des villes piétonnes **et** donnant de l'importance à la publication de données de voirie libres.
Pour améliorer sa place dans le classement il faudra donc jouer sur ces deux points, ce qui me semble vertueux.

## L'algorithme version 1

- faire une requete openstreemap via l'API overpass, qui va chercher toutes les formes que l'on considère comme piétonnes et publiques dans une ville
- transformer les résultats en geojson
- transformer les rues piétonnes en polygones, avec le paramètre width si existant, sinon avec une valeur par défaut
- calculer l'aire totale des formes et la comparer à l'aire de la ville
- classer les villes françaises

## Version 2

### Interface 
- présenter les résultats sous forme de carte. C'est compliqué, car les outils actuels (mapbox par exemple) cachent les détails au niveau de zoom de la ville. Or ici on voudrait visualiser une carte noir et blanc : zones piétonnes publiques vs le reste.

### Mesure 
- calculer le linéaire de rues piétonnes et le comparer au linéaire de rues motorisées, faire 2 scores
- intégrer aussi les voies cyclables 🚴‍
