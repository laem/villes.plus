import json from './préfectures.json'

const newHeader = [
	'codeINSEE',
	'département',
	'nom',
	'population',
	'sousPréfectures',
]

const objectJson = json
	.splice(1)
	.map((line) => Object.fromEntries(line.map((el, i) => [newHeader[i], el])))

export default objectJson
