import css from '@/css/convertToJs'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import { LogoImages, LogoWrapper } from '@/app/LogoUI'

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
		<LogoWrapper $align={align}>
			<LogoImages>
				<Image
					src={logo}
					alt="Logo de villes.plus"
					style={css`
						width: 2rem;
						height: auto;
					`}
				/>
				<span>{human.walking}</span>
			</LogoImages>
			{text && (
				<h1
					style={css`
						margin: 0;
						padding: 0;
						margin-left: 0.8rem;
						color: ${color || blue};
						display: inline;
					`}
				>
					{text}
				</h1>
			)}
		</LogoWrapper>
	)
}
