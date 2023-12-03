import { villesMoyennes } from '@/app/cyclables/communes/page'
import villes from '@/villesClassées'
import { prefecturesNames } from '@/app/cyclables/prefectures/page'
import APIUrl from '@/app/APIUrl'
import algorithmVersion, { getDirectory } from '@/../algorithmVersion'
import departements from '@/départements.yaml'

export const url = (then) => `https://villes.plus/${then}`
var date = new Date()
export const firstDayOfCurrentMonth = new Date(
	date.getFullYear(),
	date.getMonth(),
	1
)
export const toEntryObject = (list) =>
	list.map((name) => ({
		name,
		url: url(`cyclables/${name}`),
		apiUrl: APIUrl + `api/cycling/meta/${name}/${getDirectory()}`,
		lastModified: firstDayOfCurrentMonth,
	}))

export default function listComputes() {
	const grandesVilles = villes
		.map((el) => (typeof el === 'string' ? el : el[0]))
		.filter(Boolean)
		.map((name) => ({
			name,
			apiUrl: APIUrl + `api/cycling/meta/${name}/${getDirectory()}`,
			url: url(`cyclables/${name}.8`),
			lastModified: firstDayOfCurrentMonth,
		}))
	const pietonnes = villes
		.map((el) => (typeof el === 'string' ? el : el[0]))
		.filter(Boolean)
		.map((name) => ({
			name,
			apiUrl: APIUrl + `api/walking/meta/${name}/${getDirectory()}`,
			url: url(`pietonnes/${name}`),
			lastModified: firstDayOfCurrentMonth,
		}))
	const metropoles = villes
		.map((el) => (typeof el === 'string' ? null : el[1]))
		.filter(Boolean)
		.map((name) => ({
			name,
			apiUrl: APIUrl + `api/cycling/meta/${name}/${getDirectory()}`,
			url: url(`cyclables/${name}`),
			lastModified: firstDayOfCurrentMonth,
		}))
	const results = [
		metropoles,
		pietonnes,
		grandesVilles,
		toEntryObject(prefecturesNames),
		toEntryObject(departements.map((departement) => departement.nom)),
		toEntryObject(villesMoyennes),
	].flat()
	return results
}
