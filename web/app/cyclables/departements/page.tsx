import { Classement } from '@/app/Classement'
import { Metadata } from 'next'
import list from '@/départements.yaml'

console.log(list)
export const metadata: Metadata = {
	title: 'Le classement des départements les plus cyclables - villes.plus',

	description:
		'Chaque département est testé pour déterminer le pourcentage de km cyclables, strictement sécurisés.',
	openGraph: {
		images: 'https://villes-plus.vercel.app/departements.png',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default () => <div></div>
