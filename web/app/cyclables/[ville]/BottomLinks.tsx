import Link from 'next/link'
import prejecturesRawJson from '@/préfectures.json'

function mesAidesVeloURLSlugify(param: string) {
	return param
		.toLowerCase()
		.replace(/^\s+|\s+$/g, '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace('œ', 'oe')
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
}

const mapDepartementToPrefecture = Object.fromEntries(
	prejecturesRawJson
		.slice(1)
		.map(([noInsee, departementName, prefectureName]) => [
			departementName,
			prefectureName,
		])
)
export default function BottomLinks({ ville }: { ville: string }) {
	const isDepartement = Boolean(mapDepartementToPrefecture[ville])

	if (!isDepartement) return null

	return (
		<>
			<h3>Ressources utiles</h3>
			<ul>
				{ville !== 'Paris' && (
					<li>
						<Link
							href={`/cyclables/${encodeURI(
								mapDepartementToPrefecture[ville]
							)}`}
						>
							Le score cyclable de {mapDepartementToPrefecture[ville]} la
							préfecture de {ville}
						</Link>
					</li>
				)}
				<li>
					<a
						href={`https://mesaidesvelo.fr/departement/${mesAidesVeloURLSlugify(
							ville
						)}`}
						target="_blank"
					>
						Les aides à l’achat d’un vélo dans {ville}
					</a>
				</li>
			</ul>
		</>
	)
}
