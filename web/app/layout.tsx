import './globals.css'
import StyledComponentsRegistry from '../lib/registry'
import Nav, { NavFooter } from './Nav'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
})

export const metadata = {
	title: 'Villes.plus',
	description: 'Le classement des territoires les plus cyclables et piétons.',
	metadataBase: new URL('https://villes.plus'),
	openGraph: {
		images: ['https://villes.plus/api/og'],
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="fr" className={inter.className}>
			<Script
				defer
				strategy="lazyOnload"
				data-domain="villes.plus"
				src="https://plausible.io/js/script.js"
			/>
			<body>
				<StyledComponentsRegistry>
					<main>
						<Nav />
						{children}
						<NavFooter />
					</main>
				</StyledComponentsRegistry>
				<Analytics />
			</body>
		</html>
	)
}
