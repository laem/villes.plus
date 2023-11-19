import css from '@/css/convertToJs'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import { LogoImages, LogoTitle, LogoWrapper } from '@/app/LogoUI'

export default ({ text, color, cyclable, align = 'center' }) => {
	const blue = ''

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
			{text && <LogoTitle>{text}</LogoTitle>}
		</LogoWrapper>
	)
}
