'use client'
import styled from 'styled-components'

export const LogoWrapper = styled.div`
	z-index: 1;
	@media (max-width: 800px) {
		text-shadow: black 1px 1px 2px;
		color: white;
		position: absolute;
	}
	margin-top: 1rem;
	margin-bottom: 0.4rem;
	font-size: 200%;
	display: flex;
	align-items: center;
	font-size: calc(60% + 0.4vw);
	justify-content: ${(p) => p.$align};
`

export const LogoImages = styled.div`
	display: flex;
	align-items: center;
	@media (max-width: 800px) {
		display: none;
	}
`

export const LogoTitle = styled.h1`
	margin: 0;
	padding: 0;
	margin-left: 0.8rem;
	color: inherit;
	display: inline;
	@media (max-width: 800px) {
		max-width: 60vw;
		line-height: 1.4rem;
	}
`
