import { ImageResponse } from 'next/server'
import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'
const converter = new GeoJSON2SVG()

export const runtime = 'edge'

export async function GET() {
	const req = await fetch('http://localhost:8080/cartes/data')
	const geo = await req.json()
	console.log('GEO', geo.features[0].properties)

	const svgStrings = converter.convert(geo)

	const Component = html(`

				<svg fill="" viewBox="0 0 400 400" style="width: 100%; height: 100%">

${svgStrings}

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
