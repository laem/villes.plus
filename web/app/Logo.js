import css from '@/css/convertToJs'
import Image from 'next/image'
import logo from '@/public/logo.svg'

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
				display: flex;
				align-items: center;
			`}
		>
			<div
				style={css`
					position: relative;
					width: 5rem;
					font-size: 130%;
					height: 5rem;
				`}
			>
				<Image
					src={logo}
					alt="Logo de villes.plus"
					style={css`
						position: absolute;
						width: 100%;
						height: auto;
						z-index: -1;
					`}
				/>
				<span
					style={css`
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translateX(-50%) translateY(-50%);
					`}
				>
					{human.walking}
				</span>
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
