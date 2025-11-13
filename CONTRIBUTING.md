Ce classement des villes les plus piétonnes et cyclables est complètement ouvert et contributif.

## Comment aider ?

Il vous faut d'abord créer en 2 minutes ⏱ un compte [ici](https://github.com/join) sur la plateforme Github qui héberge le projet.

Vous pouvez maintenant :

- [signaler une zone piétonne manquante](https://github.com/laem/villes.plus/issues/new?assignees=&labels=&template=faux-n-gatif.md&title=Il+manque+une+zone+pi%C3%A9tonne)
- [signaler une zone piétonne qui n'en est pas une](https://github.com/laem/villes.plus/issues/new?assignees=&labels=&template=faux-positif.md&title=Une+zone+dite+pi%C3%A9tonne+n%27en+est+pas+une)
- [lancer une discussion à propos de ce que vous voulez](https://github.com/laem/villes.plus/issues/new)

## Pour les développeurs et les curieux

En gros, l'algorithme du classement est le suivant pour les zones piétonnes :

- récupérer les formes OpenStreetMap voulues, via la requête https://github.com/laem/villes.plus/blob/master/request.js. Il est possible de tester ce genre de requête (par exemple pour ajouter des formes, explorer s'il y en a dans telle ville) sur overpass-turbo.eu
- transformer les formes de type voie, qui sont en une dimension, en surface
- fusionner toutes les formes pour éviter de compter 2 fois les zones où elles se recoupent
- découper les formes avec le contour de la ville récupéré via l'API Géo
- (on avait commencé à exclure des formes, mais ce n'est plus d'actualité)

💻 Pour les développeurs : toute contribution au code est la bienvenue :-)

## Comment lancer le projet en local ?

- Cloner le dépôt

- Lancer le serveur de stockage S3 local (ici minio, ou bien vous pouvez utiliser un serveur S3 compatible distant comme Scaleway)

```sh
mise use -g minio
minio server /tmp/minio-data
```

- Créer un fichier `.env` à la racine du projet avec les variables d'environnement nécessaires (voir `.env.example`)

```bash
# API Endpoint from your MinIO output (use the 127.0.0.1 address)
S3_ENDPOINT_URL=http://127.0.0.1:9000
# RootUser from your MinIO output
ACCESS_KEY_ID=minioadmin
# RootPass from your MinIO output
ACCESS_KEY=minioadmin
# le bucket par défaut de minio (mais vous pouvez le changer)
BUCKET_NAME=data
```

- Installer bun

```sh
mise use -g bun # ou bien suivez les instructions sur https://bun.sh/
```

- installer les dépendances et lancer le serveur en local
```sh
bun install
bun start-local-router
``

- Dans un autre terminal, lancer le serveur NextJS

```sh
cd web
bun install
bun dev
```

Se rendre sur http://localhost:8080/ pour voir le site.

### Notes
- Lorsque l'on va sur une page, le calcul se lance en local, et les fichiers sont stockés dans le serveur S3 local (minio).
- Le server va parfois crasher, donc il faut le relancer de temps en temps
- ajouter `client=true` dans l'URL d'une page de territoire pour voir le calcul se faire en direct sur la carte (utile pour le debug)
