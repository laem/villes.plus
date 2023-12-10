const regExp = /[a-zA-Z]/g

export const testIsPureSpeed = (value) => {
	const notOnlyNumbers = regExp.test(value)
	if (notOnlyNumbers) console.log('oups', value)

	return !notOnlyNumbers
}

export const zoneSpeeds = {
	'FR:rural': 80,
	'FR:urban': 50,
	'FR:zone30': 30,
	'FR:motorway': 130,
}
export const highwaySpeeds = {
	motorway: 130,
	trunk: 110,
	trunk_link: 110,
	primary: 80,
	secondary: 80,
	tertiary: 80,
	residential: 50,
	living_street: 20,
}
