import Link from 'next/link'
import { Cards, LandingWrapper, Header, Card, LinkCard } from './UI'
import type { Metadata } from 'next'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import Carte from './Carte'

const title =
	'Carte de France des routes à 80 km/h par rapport aux routes à 90 km/h'
export const metadata: Metadata = {
	title,
	description: null,
}

export default () => (
	<div>
		<h1>{title}</h1>
		<Carte />
	</div>
)
