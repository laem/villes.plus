'use client'

import css from '@/css/convertToJs'

const duration = '3000ms'

export default function AnimatedIllustration({
	d = 'M 256,100 C 14,80 13,80 14,120',
	invert,
}) {
	return (
		<div
			css={`
				z-index: -1;
				width: 200px;
				height: 100px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform:
				translateX(-50%) translateY(-50%);
				opacity: .6;
				> img {
					opacity: 0.8;
					position: absolute;
					top: -1rem;
					left: -1rem;
					offset-path: path('${d}');
					animation: move ${duration};
					animation-fill-mode: both;
					animation-delay: ${!invert ? '300ms' : '0s'};
					@keyframes move {
						0% {
							opacity: 0
							offset-distance: 0%;
						}
						10 % {
							opacity: 1;
						}
						30% {
							filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.6));
						}
						70% {
							filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.1));
						}
						90% {
							offset-distance: 100%;
							opacity: 1
						}
						100% {
							offset-distance: 100%;
							opacity: 0
						}
					}
				}
				svg {
					position: absolute;
					top: 0;
					left: 0;
					width: 200px;
  height: 100px;
				}
				path {
					stroke-dasharray: 230;
					stroke-dashoffset: 230;
					opacity: 0;
					animation: draw ${duration};
					animation-fill-mode: both;
				}

				@keyframes draw {
					0% {
						opacity: 0;
						stroke-dashoffset: 230;
						stroke: red;
					}
					30% {
						stroke: red;
						opacity: 1;
					}
					90% {
						stroke-dashoffset: 10;
						stroke: #000094;
						opacity: 1
					}
					100%{
						stroke-dashoffset: 10;

						stroke: #000094;
						opacity: 0;
					}
				}
			`}
		>
			<svg viewBox="10 10 200 100">
				<path
					d={d}
					style={css`
						fill: none;
						stroke-width: 2px;
					`}
				/>
			</svg>
			<Cyclist invert={invert} />
		</div>
	)
}

const Cyclist = ({ invert }) => (
	<img
		src="/cyclist.svg"
		css={`
			width: 2rem !important;
			height: auto !important;
			transform: scaleX(-1) ${!invert && `scaleY(-1)`};
		`}
	></img>
)
