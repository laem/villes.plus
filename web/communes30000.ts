import json from './communes-pop-sup-30-000.json'

const newHeader = [
	'rang',
	'codeINSEE',
	'nom',
	'département',
	'statut',
	'région',
	'population2020',
]

const objectJson = json
	.splice(2)
	.map((line) => Object.fromEntries(line.map((el, i) => [newHeader[i], el])))

export default objectJson
