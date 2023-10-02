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

const clean = (element) => element.replace(/\[(alpha\s)?(\d)+\]/, '')

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
	.filter((el) => el.codeINSEE.slice(0, 2) < 97) //TODO here we reject Outre-Mer communes, because our points detection can't handle these communes yet
// It's not complicated, I just have to find a clever way to handle the historical complexity of

export default objectJson
