'use client'

import { colors } from '@/CyclableScoreVignette'
export default ({ scores }) => (
	<div
		css={`
			width: 100%;
			position: relative;
			margin-top: 2rem;
			max-width: 700px;
			margin: 0 auto;
		`}
	>
		{scores.map(([ville, { score }]) => (
			<span
				key={ville}
				title={`${ville} à ${score} %`}
				css={`
					position: absolute;
					left: ${100 - score}%;
					top: -11px;
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
		{[...colors].reverse().map((c, i) => {
			const score = (20 - i) / 2,
				display = !(i % 2)
			return (
				<span
					key={c}
					css={`
						z-index: 1;
						width: 5%;
						height: 1.35rem;
						display: inline-block;
						background: ${c};
						text-align: center;
						color: ${score < 5 ? 'white' : 'black'};
					`}
				>
					<span
						css={`
							visibility: ${display ? 'visible' : 'hidden'};
						`}
					>
						{score}
					</span>
				</span>
			)
		})}
	</div>
)
