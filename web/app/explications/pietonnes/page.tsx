import React from 'react'
import Article from '@/app/Article'
import Content from './content.mdx'

export const metadata: Metadata = {
	title: 'Explications du classement piéton - villes.plus',
	description: `La méthode consiste à calculer la surface d'une ville dédiée aux piétons, puis la diviser par la surface totale de la commune.`,
}
export default () => (
	<Article>
		<Content />
	</Article>
)
