'use client'
import styled from 'styled-components'

export const LandingWrapper = styled.div`
	text-align: center;
`

export const Card = styled.div`
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
	border: 4px solid var(--color2);
	border-radius: 0.4rem;
	padding: 0.6rem;
	box-shadow: rgb(187, 187, 187) 2px 2px 10px;
	${(p) =>
		p.$fullWidth &&
		`
	width: auto;


	`}
`
export const LinkCard = styled(Card)`
	a {
		text-decoration: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
`

export const Cards = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
`
export const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: 4rem;
		height: auto;
		margin-right: 0.4rem;
	}
	font-size: 140%;
	margin: 4vh 0;

	h1 {
		margin: 0;
		background-image: linear-gradient(90deg, #7b65e2, #af3dbb);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}
`
