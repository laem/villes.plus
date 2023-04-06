import { ImageResponse } from '@vercel/og'
import getCityData, { toThumb } from '@/app/wikidata'

export const config = {
	runtime: 'edge',
}

export default async function handler(req) {
	//	const response = await fetch()
	const response = await getCityData('Reims')
	const wikidata = response?.results?.bindings[0]

	const image = wikidata?.pic.value && toThumb(wikidata.pic.value)
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					width: '550px',
					height: '300px',
				}}
			>
				<img
					src={image}
					style={{
						objectFit: 'cover',
						position: 'absolute',
						height: '100%',
						width: '100%',
						inset: '0px',
						color: 'transparent',
						opacity: 0.6,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translateX(-50%)',
						fontSize: '300%',
					}}
				>
					Score cyclable : 3 / 10
				</div>
			</div>
		),
		{
			width: 550,
			height: 300,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
