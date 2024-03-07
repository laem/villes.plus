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

## Mise à jour mensuelle (presque) automatique

Chaque mois, ou chaque trimestre, à la guise du développeur, tous les calculs peuvent être relancés. C'est pseudo-automatisé. 

> Pas de panique si on n'es pas trop dispo un mois donné : Vercel aura déjà compilé les pages HTML pour le mois d'avant, et continuera de les servir tant que les recalculs et un rebuild next n'auront pas été lancé. La contrainte est donc de ne pas pusher de nouveau commit si l'on n'est pas prêt à consacrer quelques heures à la campagne de MAJ des calculs. 

> Bon à savoir : sur scalingo, il est très facile de scaler les serveurs. Quand la campagne mensuelle de recalcul des classements commence, mettre 1 ou 2 machines à la taille 2XL. Quand elle est terminée, je vous conseille de les remettre à une taille S. Ça rendra les calculs rapides, sans trop de risque de dépassement de mémoire, et ça ne vous coutera pas grand chose. On peut s'attendre à un coût de ~ 500€ / an si bien géré, voir beaucoup moins.

> À vrai dire, c'est la principale difficulté de la maintenance de cette application : parfois, ça crashe. Manque de mémoire, timeout du côté de scalingo, etc. Les fonctions de fetch dans le code sont en général englobées dans un try {} catch () qui explique ce qui se passe mal, mais des fois ça reste compliqué à débugguer. Par exemple, en ne mettant que deux serveurs brouter taille M, certaines requêtes passent en timeout (il doit calculer trop d'itinéraires à la fois, et l'un prend plus de 30 secondes, et là scalingo envoie un message HTML d'erreur au lieu du résultat JSON) pour la Métropole du Grand Paris. Avec 4 serveurs, ça passe.

Pour mener une campagne de mise à jour, il est important de relancer les serveurs laem/brouter-standalone sur scalingo : les dernières données OSM sont téléchargées à l'initialisation du serveur via le script https://github.com/laem/brouter-standalone/blob/master/download.sh.

> Note : ce téléchargement pièce par pièce est un peu relou. Il pourrait être fait une fois pour toute, puis un gros fichier complet serait téléchargé sur chaque serveur Scalingo, périodiquement.

Une route /dashboard a été mise en place pour lancer les nouveaux calculs le 1er du mois. On peut y voir chaque ville être recalculée. Ça prend 1 à 3h en fonction des serveurs scalingo choisis. 

Il y a souvent des villes pour lesquelles la mise en cache ne marche pas, j'ignore à ce stade pourquoi. Il faut parfois vider le Data cache de Vercel : je suspecte que Vercel a mis en cache des réponses "ville pas encore calculée" alors que notre serveur node les a bien terminées. C'est dans les options Vercel du projet Next. 

![image](https://github.com/laem/villes.plus/assets/1177762/63f93498-a442-4c06-a040-178323741839)

Aussi, je viens de comprendre une source d'erreur en plus : le serveur scalingo a son propre cache express. Après la campagne de mise à jour faite en début de mois, il faut le relancer pour réinitialiser le cache. Et ce, avant de demander à Vercel de recompiler l'appli Next. 

On n'est pas loin cependant d'une automatisation complète. Il suffirait d'un cron qui MAJ les serveurs scalingo, lance les calculs, etc. Mais ça demande quand même quelques jours de boulot pour bien faire tout ça. 

## Debug

L'application proposait aussi un mode intéractif, dit `client`, au moyen du paramètre `client=true` dans l'URL d'une page de territoire. Il permet de voir la carte cyclable se composer en temps réel, segment par segment, pratique pour débugguer et comprendre comment l'algo fonctionne :). À voir s'il fonctionne toujours, je l'ai utilisé beaucoup dans les phases d'itération sur l'algo. En tout cas, ce n'est pas compliqué à remettre en place : tout le code front / back est en JS, donc compatible. C'est juste une question de charge côté client et de cache des calculs (lourds). 

## Internationalisation

We'd love to make these rankings available in your country, but we don't have the dev force yet, nor money. If you have one of those, contact us at https://matrix.to/#/@maelito:matrix.org.
