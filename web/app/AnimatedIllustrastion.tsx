'use client'

export default function AnimatedIllustration() {
	return (
		<div
			css={`
				offset-path: path('M.4 84.1s127.4 188 267.7 0 247.3 0 247.3 0');
				animation: move 2000ms;
				@keyframes move {
					100% {
						offset-distance: 100%;
					}
				}
			`}
		>
			<Cyclist />
		</div>
	)
}

const Cyclist = () => (
	<span
		css={`
			background: purple;
			border-radius: 2rem;
			width: 2rem;
			height: 2rem;
			display: inline-block;
		`}
	></span>
)
