import Link from 'next/link'
import css from 

export default ({ text, color, cyclable }) => {
	const blue = '#1e3799'

	const goodEmoji = cyclable ? '🚴' : '🚶'
	const firstEmoji = cyclable ? '🚳' : '🧍'
	const human =
		new Date().getHours() % 2 > 0
			? {
					walking: goodEmoji + '‍♀️',
					standing: firstEmoji + (!cyclable ? '‍♀️' : ''),
			  }
			: {
					walking: goodEmoji + '‍♂️',
					standing: firstEmoji + (!cyclable ? '‍♂️' : ''),
			  }
	return (
		<div
			style={css`
				font-size: 200%;
			`}
		>
			<Link
				href="/"
				style={css`
					text-decoration: none;
				`}
			>
				<span>{human.walking}</span>
				{text && (
					<h1
						style={css`
							margin-left: 0.6rem;
							color: ${color || blue};
							font-size: 100%;
							display: inline;
							@media (max-width: 500px) {
								font-size: 80%;
							}
						`}
					>
						{text}
					</h1>
				)}
			</Link>
		</div>
	)
}
