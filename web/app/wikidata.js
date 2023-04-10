import md5 from '../../md5'

const correspondanceMétropoleVille = {}

const endpointUrl = 'https://query.wikidata.org/sparql'
const getQuery = (cityName) => `#defaultView:ImageGrid
SELECT distinct ?item ?itemLabel ?itemDescription ?pic ?population ?area WHERE{
  ?item ?label "${cityName}"@fr;
   wdt:P18 ?pic;
   wdt:P1082 ?population;
   wdt:P2046 ?area.
  ?article schema:about ?item .
  ?article schema:inLanguage "en" .
  ?article schema:isPartOf <https://en.wikipedia.org/>.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
 `

export default async (cityName) => {
	const correspondance = correspondanceMétropoleVille[cityName]
	const queryCity = correspondance || cityName

	const query = getQuery(queryCity)

	const fullUrl = endpointUrl + '?query=' + encodeURIComponent(query)
	const headers = { Accept: 'application/sparql-results+json' }

	console.log('will fetch wikidata server')

	const response = await fetch(fullUrl, { headers })
	const json = await response.json()

	const wikidata = json?.results?.bindings[0]

	const image = wikidata?.pic.value && toThumb(wikidata.pic.value)

	return { image, data: wikidata }
}

const toThumb = (url, width = 550) => {
	const paths = url.includes('FilePath/')
		? url.split('FilePath/')
		: url.split('Fichier:')
	const fileName = paths[1]
	const decoded = decodeURIComponent(fileName).replaceAll(' ', '_')
	const hash = md5(unescape(encodeURIComponent(decoded)))

	return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash[0]}${hash[1]}/${decoded}/${width}px-${fileName}`
}
