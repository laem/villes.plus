import { Classement } from '@/app/Classement'
import { getData } from '../page'

export default async function Page({ params: { region } }) {
	const région = decodeURIComponent(region)
	const allData = await getData()

	const data = Object.fromEntries(
		Object.entries(allData).filter(([k, v]) => v.région === région)
	)

	return (
		<Classement
			cyclable
			data={data}
			text={`Quelles départements de la région ${région} sont les plus cyclables ?`}
		/>
	)
}
