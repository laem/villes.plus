import './globals.css'
import StyledComponentsRegistry from '../lib/registry'
import Nav from './Nav'

export const metadata = {
	title: 'Villes.plus',
	description: 'Le classement des territoires les plus cyclables et piétons.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="fr">
			<body>
				<StyledComponentsRegistry>
					<Nav />
					{children}
				</StyledComponentsRegistry>
			</body>
		</html>
	)
}
