import React from 'react'
import Article from '@/app/Article'
import Content from './content.mdx'

export const metadata: Metadata = {
	title: 'Explications du classement cyclable - villes.plus',
	description: `La méthode consiste à calculer le trajet vélo le plus sécurisé entre des points représentatifs du territoire : mairies et sélection d'arrêts de bus. Pour chaque point, les trajets vers les 4 points adjacents sont testés. Est cyclable un ségment réservé aux cyclistes et séparé des voitures, ou bien une voie sur laquelle ils sont prioritaires.`,
}
export default () => (
	<Article>
		<Content />
	</Article>
)
