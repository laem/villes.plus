import css from '@/css/convertToJs'
import Image from 'next/image'
import logo from '@/public/logo.svg'

export default ({ text, color, cyclable, align = 'center' }) => {
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
			style={css(`
				margin-top: 1rem;
				margin-bottom: .4rem;
				font-size: 200%;
				display: flex;
				align-items: center;
				justify-content: ${align};
			`)}
		>
			<div
				style={css`
					font-size: 130%;
					display: flex;
					align-items: center;
				`}
			>
				<Image
					src={logo}
					alt="Logo de villes.plus"
					style={css`
						width: 3rem;
						height: auto;
					`}
				/>
				<span style={css``}>{human.walking}</span>
			</div>
			{text && (
				<h1
					style={css`
						margin: 0;
						padding: 0;
						margin-left: 0.8rem;
						color: ${color || blue};
						font-size: calc(80% + 0.8vw);
						display: inline;
					`}
				>
					{text}
				</h1>
			)}
		</div>
	)
}
