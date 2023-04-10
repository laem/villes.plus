import { MetadataRoute } from 'next'
import villes from '@/villesClassées'
import basePaths from '@/baseSitemap.yaml'

const url = (then) => `https://villes.plus/${then}`
var date = new Date()
const firstDayOfCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 1)

export default function sitemap(): MetadataRoute.Sitemap {
	const cyclables = villes
		.map((el) => (typeof el === 'string' ? null : el[1]))
		.filter(Boolean)
		.map((name) => ({
			url: url(`cyclables/${name}`),
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

	return [...base, ...cyclables, ...pietonnes]
}
