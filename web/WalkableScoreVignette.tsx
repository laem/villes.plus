'use client'

export default ({ data }) => (
	<div
		css={`
			text-align: center;
			font-size: 170%;
			margin-left: 1rem;

			@media (min-width: 800px) {
				font-size: 260%;
				margin-left: 2rem;
			}
			display: flex;
			flex-direction: column;
		`}
	>
		<div>
			<span
				css={`
					font-weight: 600;
				`}
			>
				{data && data.percentage < 0 ? '⏳️' : data.percentage.toFixed(0)}
			</span>
			<small> %</small>
		</div>

		<div
			css={`
				width: 8rem;
				text-align: left;
				font-size: 60%;
			`}
		>
			{data.pedestrianArea && data.relativeArea && (
				<span
					css={`
						font-size: 80%;
						color: #1e3799;
					`}
				>
					{data.pedestrianArea.toFixed(1)} sur {data.relativeArea.toFixed(1)}
					&nbsp;km²
				</span>
			)}

			{/* 			{data.meanStreetWidth +
													' | ' +
													data.streetsWithWidthCount}
										*/}
		</div>
	</div>
)
