'use client'

import css from '@/css/convertToJs'

export default function AnimatedIllustration() {
	const d = 'M20,20 C20,100 200,0 200,100'
	const viewBox = '10 10 200 100'
	return (
		<div
			css={`
				z-index: -1;
				width: 20vw;
				position: absolute;
				top: 2rem;
				left: 50%;
				transform: translateX(-50%);
				> img {
					opacity: 0.8;
					position: absolute;
					top: 0;
					left: 0;
					offset-path: path('${d}');
					animation: move 6000ms;
					animation-fill-mode: both;
					@keyframes move {
						0% {
							opacity: 1;
							offset-distance: 0%;
						}
						30% {
							filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.6));
						}
						70% {
							filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1));
						}
						90% {
							offset-distance: 100%;
						}
						100% {
							offset-distance: 100%;
						}
					}
				}
				svg {
					position: absolute;
					top: 0;
					left: 0;
				}
				path {
					stroke-dasharray: 230;
					stroke-dashoffset: 230;
					animation: draw 6000ms;
					animation-fill-mode: both;
				}

				@keyframes draw {
					0% {
						stroke-dashoffset: 230;
						stroke: red;
					}
					30% {
						stroke: red;
					}
					100% {
						stroke-dashoffset: 10;
						stroke: #000094;
					}
				}
			`}
		>
			<svg>
				<path
					d={d}
					style={css`
						fill: none;
						stroke-width: 2px;
					`}
				/>
			</svg>
			<Cyclist />
		</div>
	)
}

const Cyclist = () => (
	<img
		src="/cyclist.svg"
		css={`
			width: 2rem !important;
			height: auto !important;
			transform: scaleX(-1);
		`}
	></img>
)
