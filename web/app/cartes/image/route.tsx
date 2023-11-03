import { GeoJSON2SVG } from 'geojson2svg'
import { ImageResponse } from 'next/server'
import { html } from 'satori-html'
const converter = new GeoJSON2SVG()

export const runtime = 'edge'

export async function GET() {
	const req = await fetch('http://localhost:8080/cartes/data')
	const geo = await req.json()

	const svgStrings = converter.convert(geo, {
		viewportSize: { width: 400, height: 400 },
		mapExtent: { left: 0, bottom: 0, right: 400, top: 400 },
	})

	const Component = html(`

				<svg fill="" viewBox="0 0 300 150" style="width: 100%; height: 100%">

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
			width: 1200,
			height: 900,
		}
	)
}
