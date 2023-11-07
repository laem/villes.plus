'use client'
export default function Shape({ polygon }) {
	return (
		<path
			d={
				polygon.geometry.coordinates
					.map((c, i) => (i ? `${c[0]} ${c[1]}` : `M${c[0]} ${c[1]}`))
					.join(' ') + 'Z'
			}
		/>
	)
}
