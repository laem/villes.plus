import { MetadataRoute } from 'next'
import villes from '@/villesClassées'
import basePaths from '@/baseSitemap.yaml'
import { villesMoyennes } from './cyclables/communes/page'
import { prefecturesNames } from './cyclables/prefectures/page'
import departements from '@/départements.yaml'

const url = (then) => `https://villes.plus/${then}`
var date = new Date()
const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

const toEntryObject = (list) =>
	list.map((name) => ({
		url: url(`cyclables/${name}`),
		lastModified: firstDayOfCurrentMonth,
	}))

export default function sitemap(): MetadataRoute.Sitemap {
	const metropoles = villes
		.map((el) => (typeof el === 'string' ? null : el[1]))
		.filter(Boolean)
		.map((name) => ({
			url: url(`cyclables/${name}`),
			lastModified: firstDayOfCurrentMonth,
		}))
	const grandesVilles = villes
		.map((el) => (typeof el === 'string' ? el : el[0]))
		.filter(Boolean)
		.map((name) => ({
			url: url(`cyclables/${name}.8`),
			lastModified: firstDayOfCurrentMonth,
		}))
	const pietonnes = villes
		.map((el) => (typeof el === 'string' ? el : el[0]))
		.filter(Boolean)
		.map((name) => ({
			url: url(`pietonnes/${name}`),
			lastModified: firstDayOfCurrentMonth,
		}))
	const base = basePaths.map((path) => ({
		url: url(path),
		lastModified: firstDayOfCurrentMonth,
	}))

	const regions = Object.keys(
		departements.reduce(
			(memo, next) => ({ ...memo, [next.nom_region]: null }),
			{}
		)
	)

	const results = [
		base,
		metropoles,
		pietonnes,
		grandesVilles,
		toEntryObject(prefecturesNames),
		toEntryObject(departements.map((departement) => departement.nom)),
		toEntryObject(regions.map((region) => '/departements/' + region)),
		toEntryObject(villesMoyennes),
	].flat()
	console.log('Le sitemap a généré ' + results.length + ' entrées')
	return results
}
