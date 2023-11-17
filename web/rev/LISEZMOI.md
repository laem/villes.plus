# Comment ajouter le REV (Réseau Express Vélo) de mon territoire ?

> Pour l'instant, seules les métropoles affichent leurs REV. Mais n'hésitez pas à travailler un réseau pour votre ville / votre département : nous pourrons l'afficher si vous représentez une collectivité ou une association vélo.

Les REV sont affichés sur villes.plus quand leurs données existent, sont conformes (au format geojson), et sont renseignées dans le code de villes plus. On vous explique tout.

## 1) tracer le REV

Certaines villes ont déjà des données ouvertes de leur REV. D'autres n'ont que des images publiées par la ville. D'autres n'ont rien du tout, la proposition politique reste à construire.

## 2) Le publier dans le format GEOJSON

C'est un format ouvert pour publier des données géographiques.

Le plus simple est d'utiliser http://umap.openstreetmap.fr. Voici un exemple avec [le REV de Rennes](http://umap.openstreetmap.fr/fr/map/rev-rennes_977499).

Une fois la carte umap réalisée à l'instar de cet exemple pour Rennes, vous pouvez télécharger les données, l'intégration dans villes.plus sera très aisée.

L'autre exemple, c'est l'asso de Lyon nommée La Ville à Vélo qui avec Benoit Demaegdt a publié cyclopolis.fr, un site dédié aux Voies Lyonnaises de Lyon. Ils ont exposé leur données en gejoson directement sur github : il nous suffit alors du lien vers le dossier github pour les intégrer sur villes.plus.

Si vos lignes de REV ont des noms et des couleurs, spécifiez-les avec les attributs `name` et `color` dans les propriétés des `features` de type `LineString`.

## 3) Faire de la plomberie

Une fois que vous disposez de ce fichier GEOJSON, créez un ticket sur [le formum villes.plus](https://github.com/laem/villes.plus/issues/). Nous ferons le nécessaire pour l'intégrer au plus vite.

## 4) La suite 🤩

Progressivement, nous intégrerons des métriques pour évaluer les REV : distance couverte en voie de qualité, ratio par rapport à la taille de la métropole, indicateurs d'avancement, logo et iconographie propre à chaque métropole, etc.
