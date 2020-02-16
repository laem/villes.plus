import React, { PureComponent } from 'react'
import { Layer, Feature } from 'react-mapbox-gl'

export default class DebugMap extends PureComponent {
	render() {
		const { villeExceptions, data, setDebugData } = this.props
		return (
			<>
				<Layer
					type="fill"
					paint={{
						'fill-color': 'red',
						'fill-opacity': 0.5
					}}
				>
					{data.polygons
						.filter(f => villeExceptions.includes(f.properties.id))
						.map(polygon => (
							<Feature
								onClick={() => setDebugData(polygon.properties)}
								coordinates={polygon.geometry.coordinates}
							></Feature>
						))}
				</Layer>
				<Layer
					type="fill"
					paint={{
						'fill-color': 'blue',
						'fill-opacity': 0.5
					}}
				>
					{data.polygons
						.filter(f => !villeExceptions.includes(f.properties.id))
						.map(polygon => (
							<Feature
								onClick={() => setDebugData(polygon.properties)}
								coordinates={polygon.geometry.coordinates}
							></Feature>
						))}
				</Layer>
			</>
		)
	}
}
