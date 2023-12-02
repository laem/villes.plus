'use client'
import css from '@/css/convertToJs'
import Link from 'next/link'
import CityNumericResult from '../CityNumericResult'
import listComputes from './listComputes'

export default function Client({ data, territories }) {
	if (!data) return null

	return (
		<ul>
			{territories.map((t, i) => (
				<li
					key={t.url}
					style={css`
						display: flex;
						align-items: center;
					`}
				>
					<Link href={t.apiUrl}>{t.name}</Link>
					<CityNumericResult
						{...{ cyclable: true, ville: t.name, initialData: data[i] }}
					/>
				</li>
			))}
		</ul>
	)
}
