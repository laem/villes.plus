export default ({ data }) => {
	const note = data.score / 10
	const noteDigit = Math.floor(note),
		noteDecimalDigit = Math.round((note - noteDigit) * 10)
	const color = 'red'

	return (
		<div
			css={`
				text-align: center;
				margin-left: 1rem;

				@media (min-width: 800px) {
					font-size: 260%;
					margin-left: 2rem;
				}
				display: flex;
				flex-direction: column;
				justify-content: center;
				background: ${color};
				border: 5px solid var(--color1);
				border-radius: 0.6rem;
				padding: 0.4rem 1rem;
				width: 5.5rem;
				font-size: 250%;
				small {
					font-size: 50%;
				}
			`}
		>
			<div>
				<strong>{noteDigit}</strong>
				<small>,{noteDecimalDigit}</small>
			</div>
			<span
				css={`
					font-size: 60%;
				`}
			>
				/10
			</span>
		</div>
	)
}

const roundHalf = function (n) {
	return +(Math.round(n * 2) / 2).toFixed(1)
}
