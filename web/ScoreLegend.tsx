'use client'

import { colors } from '@/CyclableScoreVignette'
export default ({ scores }) => (
	<div
		css={`
			width: 100%;
			position: relative;
		`}
	>
		{scores.map(([ville, { score }]) => (
			<span
				key={ville}
				title={`${ville} à ${score} %`}
				css={`
					position: absolute;
					left: ${100 - score}%;
					top: -5px;
					height: 2rem;
					opacity: 0.3;
					width: 0rem;
					z-index: -1;
					border-left: 5px solid transparent;
					border-right: 5px solid transparent;
					border-top: 12px solid black;
				`}
			></span>
		))}
		{[...colors].reverse().map((c) => (
			<span
				key={c}
				css={`
					z-index: 1;
					width: 5%;
					height: 0.6rem;
					display: inline-block;
					background: ${c};
				`}
			></span>
		))}
	</div>
)
