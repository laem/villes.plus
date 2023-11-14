export default function SegmentInfo({ clickedSegment, clickedLatLon }) {
	return (
		<section>
			<h3>Informations sur le segment cliqué</h3>
			{!clickedSegment && (
				<p>
					💡 Pour comprendre pourquoi un segment est classifié cyclable (bleu)
					ou non cyclable (rouge), cliquez dessus !
				</p>
			)}
			{clickedLatLon && (
				<div
					css={`
						a {
							display: block;
							margin: 0.2rem 0;
						}
					`}
				>
					<a
						href={`http://maps.google.com/maps?q=&layer=c&cbll=${clickedLatLon.lat},${clickedLatLon.lon}`}
						target="_blank"
					>
						📸 Vue Google StreetView
					</a>
					<a
						href={`https://www.openstreetmap.org/query?lat=${clickedLatLon.lat}&lon=${clickedLatLon.lon}`}
						target="_blank"
					>
						🗺️ Carte OpenStreetMap
					</a>
				</div>
			)}
			<br />
			{clickedSegment && (
				<div>
					<p>
						Ce segment est traversé {clickedSegment.properties.rides.length}{' '}
						fois, il compte donc autant de fois dans le score du territoire.
					</p>
					Tags OSM du segment :{' '}
					<ul
						css={`
							margin-left: 2rem;
						`}
					>
						{clickedSegment.properties.tags.split(' ').map((tag) => (
							<li key={tag}>{tag}</li>
						))}
					</ul>
				</div>
			)}
		</section>
	)
}
