import { ImageResponse } from '@vercel/og'
import getCityData, { toThumb } from '@/app/wikidata'

export const config = {
	runtime: 'edge',
}

// Make sure the font exists in the specified path:
const font = fetch(
	new URL('../../assets/Inter-ExtraBold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

export default async function handler() {
	const fontData = await font

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					height: '100%',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: '"Inter"',
					backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
					fontSize: 80,
					letterSpacing: -2,
					fontWeight: 1200,
					textAlign: 'center',
				}}
			>
				<img src="https://www.villes.plus/logo.svg" width="90" />
				<div
					style={{
						marginLeft: '1rem',
						backgroundImage: 'linear-gradient(90deg, #7b65e2, #af3dbb)',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Villes.plus
				</div>
			</div>
		),
		{
			width: 550,
			height: 300,
			fonts: [
				{
					name: 'Inter',
					data: fontData,
				},
			],
		}
	)
}
