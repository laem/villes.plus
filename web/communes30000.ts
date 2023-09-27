import json from './communes-pop-sup-30-000.json'
import grandesVilles from './villesClassées'

const newHeader = [
	'rang',
	'codeINSEE',
	'nom',
	'département',
	'statut',
	'région',
	'population2020',
]

const clean = (element) => element.replace(/\[alpha\s\d\]/, '')
const objectJson = json
	.splice(2)
	.map((line) =>
		Object.fromEntries(line.map((el, i) => [newHeader[i], clean(el)]))
	)
	.filter(
		(el) =>
			!grandesVilles.find((v) =>
				typeof v === 'string' ? v === el.nom : v[0] === el.nom
			)
	)
	.slice(0, 20)

export default objectJson
