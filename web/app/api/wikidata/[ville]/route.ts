import getCityData from '@/app/wikidata'
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

		return NextResponse.json(response)
	} catch (e) {
		console.log(e)
	}
}
