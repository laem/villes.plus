import { Classement } from '../Classement'
import APIUrl from '@/app/APIUrl'
import villesListRaw from '@/villesClassées'

const cyclable = true
const villesList = villesListRaw
	.map((element) =>
		typeof element === 'string'
			? cyclable
				? null
				: element
			: cyclable
			? element[1]
			: element[0]
	)
	.filter(Boolean)

async function getData() {
	const response = await Promise.all(
		villesList.map((ville) => {
			const url =
				APIUrl + `api/${cyclable ? 'cycling' : 'walking'}/meta/${ville}`
			return fetch(
				url,
				{ cache: 'no-store' } // I don't get why next caches a wrong version
			).then((yo) => yo.json())
		})
	)

	return response.reduce(
		(memo, data, i) => ({ ...memo, [villesList[i]]: data }),
		{}
	)
}
export default async function Page() {
	const data = await getData()
	return <Classement cyclable data={data} />
}
