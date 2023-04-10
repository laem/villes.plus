import getCityData, { toThumb } from '@/app/wikidata'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{
		params,
	}: {
		params: { ville: string }
	}
) {
	const ville = params.ville

	try {
		const response = await getCityData([ville] || ville)
		const wikidata = response?.results?.bindings[0]

		const image = wikidata?.pic.value && toThumb(wikidata.pic.value)
		console.log(ville, image)

		return NextResponse.json({ image, data: wikidata })
	} catch (e) {
		console.log(e)
	}
}
