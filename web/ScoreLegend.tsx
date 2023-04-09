'use client'

import { colors } from '@/CyclableScoreVignette'
export default () => (
	<div
		css={`
			width: 100%;
		`}
	>
		{[...colors].reverse().map((c) => (
			<span
				css={`
					width: 5%;
					height: 0.6rem;
					display: inline-block;
					background: ${c};
				`}
			></span>
		))}
	</div>
)
