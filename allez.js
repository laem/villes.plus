import request from './request.js'
import fetch from 'node-fetch'
import osmtogeojson from 'osmtogeojson'

/*
 fetch(`
https://www.overpass-api.de/api/interpreter?data=${escape(request)}`)
  .then(r => r.json())
  .then(json => console.log(JSON.stringify(osmtogeojson(json))));
*/

import geoJson from './geo.json'

let typeCount = geoJson.features.reduce((memo, next) => {
	let t = next.geometry.type
	memo[t] = (memo[t] || 0) + 1
	return memo
}, {})

console.log(typeCount)

//[out:json];node[highway=speed_camera](43.46669501043081,-5.708215989569187,43.588927989569186,-5.605835010430813);out%20meta;
