'use client'
import styled from 'styled-components'
import APIUrl from '@/app/APIUrl'

export default () => (
	<Wrapper>
		<div id="loop" className="center"></div>
		<div id="bike-wrapper" className="center">
			<img src={'/velo.svg'} className="centerBike" />
		</div>
	</Wrapper>
)
const Wrapper = styled.div`
	.centerBike {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 18px;
		margin-left: -12px;
		height: 30px;
	}

	.center {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -50px;
		margin-left: -50px;
	}

	#loop {
	}

	#loop:before {
		--color: #1e3799;
		background: linear-gradient(
			to left,
			var(--color) 0%,
			var(--color) 30%,
			var(--color) 70%,
			var(--color) 100%
		);
		content: '';
		display: block;
		height: 4px;
		left: -100px;
		position: relative;
		top: 100px;
		width: 300px;
	}

	#bike-wrapper {
		height: 108px;
		width: 108px;
		animation: drive 3s linear infinite;
	}

	@keyframes drive {
		0% {
			margin-left: -364px;
			opacity: 0;
		}
		25% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		90% {
			opacity: 0;
		}
		100% {
			margin-left: 264px;
			opacity: 0;
		}
	}
`
