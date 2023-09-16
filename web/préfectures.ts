import json from './préfectures.json'

const header = json[0]

const objectJson = json
	.splice(1)
	.map((line) => Object.fromEntries(line.map((el, i) => [header[i], el])))

export default objectJson
