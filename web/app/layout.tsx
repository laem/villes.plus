import './globals.css'
import StyledComponentsRegistry from '../lib/registry'
import Nav, { NavFooter } from './Nav'
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
})

export const metadata = {
	title: 'Villes.plus',
	description: 'Le classement des territoires les plus cyclables et piétons.',
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
			<body>
				<StyledComponentsRegistry>
					<Nav />
					{children}
					<NavFooter />
				</StyledComponentsRegistry>
			</body>
		</html>
	)
}
