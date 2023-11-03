import { ImageResponse } from 'next/server'
import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'
const converter = new GeoJSON2SVG()

const svgStrings = converter.convert(features)

export const runtime = 'edge'

const Component = html(`

				<svg fill="black" viewBox="0 0 400 400" style="width: 100%; height: 100%">

${svgStrings}

				</svg>`)
console.log(svgStrings)
export async function GET() {
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					fontSize: 40,
					color: 'black',
					background: 'blue',
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
