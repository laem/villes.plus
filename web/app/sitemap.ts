import { MetadataRoute } from 'next'
import basePaths from '@/baseSitemap.yaml'
import departements from '@/départements.yaml'
import listComputes, {
	firstDayOfCurrentMonth,
	toEntryObject,
	url,
} from './dashboard/listComputes'

export default function sitemap(): MetadataRoute.Sitemap {
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

	const computes = listComputes()
	const results = [
		base,
		toEntryObject(regions.map((region) => 'departements/' + region)),
		...computes,
	]
		.flat()
		.map(({ apiUrl, name, ...rest }) => rest)
	console.log('Le sitemap a généré ' + results.length + ' entrées')
	return results
}
