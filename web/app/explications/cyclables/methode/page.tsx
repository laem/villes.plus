import React from 'react'
import Article from '@/app/Article'
import Content, { title , description} from './content.mdx'

export const metadata: Metadata = {
	title,
	description,
}
export default () => (
	<Article>
		<Content />
	</Article>
)
