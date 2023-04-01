'use client'
import styled from 'styled-components'

export const LandingWrapper = styled.div`
	text-align: center;
`

export const Cards = styled.div`
	height: 70%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	a {
		margin: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 12rem;
		text-align: center;
		span {
			font-size: 300%;
		}
		text-decoration: none;
		border: 4px solid #4117b3;
		border-radius: 0.4rem;
		padding: 0.6rem;
	}
`
