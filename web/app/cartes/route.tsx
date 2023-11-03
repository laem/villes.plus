import { ImageResponse } from 'next/server'
import { GeoJSON2SVG } from 'geojson2svg'
import features from './features.json'
import { html } from 'satori-html'
import régions from '../../régions.yaml'
const converter = new GeoJSON2SVG()

export const runtime = 'edge'

const getGeo = async () => {
	const req = await Promise.all(
		régions.map(({ osmId }) =>
			fetch(
				`http://polygons.openstreetmap.fr/get_geojson.py?id=${osmId}&params=0.020000-0.005000-0.005000`
			).then((r) => r.json())
		)
	)
	console.log('req', req)

	return {
		type: 'FeatureCollection',
		features: req.map((geometry) => ({
			type: 'Feature',
			properties: {
				stroke: '#555555',
				'stroke-width': 2,
				'stroke-opacity': 1,
				fill: '#e01b24',
				'fill-opacity': 0.5,
			},
			geometry: geometry,
		})),
	}
}

export async function GET() {
	const geo = await getGeo()
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
