import { GeoJSON2SVG } from 'geojson2svg'
import { ImageResponse } from 'next/server'
import { html } from 'satori-html'
const converter = new GeoJSON2SVG()

export const runtime = 'edge'

export async function GET() {
	const req = await fetch('http://localhost:8080/cartes/data')
	const geo = await req.json()

	const svgStrings = converter.convert(geo, {
		attributes: ['properties.osmId', 'properties.nom', 'properties.style'],
	})

	const Component = html(`

				<svg fill="" viewBox="-10 -5 290 180" style="width: 100%; height: 100%; transform: translateY(0%)">

${svgStrings.join('')}

				</svg>`)
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					fontSize: 40,
					color: 'black',
					background: 'transparent',
					width: '100%',
					height: '100%',
					textAlign: 'center',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{Component}
			</div>
		),
		{
			width: 900,
			height: 900,
		}
	)
}
