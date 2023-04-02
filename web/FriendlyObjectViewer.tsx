const capitalise0 = (string) => string[0].toUpperCase() + string.slice(1)

const FriendlyObjectViewer = ({ data, level = 0, context }) => {
	if (typeof data === 'string') {
		try {
			return capitalise0(data)
		} catch (e) {
			console.log(e)
			return <span>{capitalise0(data)}</span>
		}
	}
	if (typeof data === 'number') return <span>{data}</span>

	const isArray = Object.keys(data).every((key) => Number.isInteger(+key))
	const Level = isArray ? (
		<ol
			css={`
				padding-left: 1rem;
				list-style-type: circle;
			`}
		>
			{Object.entries(data).map(([key, value]) => (
				<li key={key}>
					<FriendlyObjectViewer
						data={value}
						level={level + 1}
						context={context}
					/>
				</li>
			))}
		</ol>
	) : (
		<ul
			css={`
				list-style-type: none;
				margin-bottom: 0;
			`}
		>
			{Object.entries(data).map(([key, value]) =>
				typeof value === 'string' || typeof value === 'number' ? (
					<li key={key}>
						<span>{capitalise0(key)}:</span>
						<span
							css={`
								margin-left: 1rem;
							`}
						>
							<FriendlyObjectViewer
								data={value}
								level={level + 1}
								context={context}
							/>
						</span>
					</li>
				) : (
					<li key={key}>
						<div>{capitalise0(key)}:</div>
						<div
							css={`
								margin-left: 1rem;
							`}
						>
							<FriendlyObjectViewer
								data={value}
								level={level + 1}
								context={context}
							/>
						</div>
					</li>
				)
			)}
		</ul>
	)

	if (level === 0)
		return (
			<div
				css={`
					border: 1px solid var(--darkColor);
					padding: 0.2rem 1rem;
					border-radius: 0.2rem;
				`}
			>
				{Level}
			</div>
		)
	return Level
}

export default FriendlyObjectViewer
