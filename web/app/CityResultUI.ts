'use client'
import styled from 'styled-components'

export const Title = styled.h3`
	font-weight: bold;
	font-size: 130%;
	@media (min-width: 800px) {
		font-size: 160%;
	}
	margin: 0.4rem 0;

	white-space: nowrap;
	max-width: 85%;
	overflow: scroll;

	> span {
		width: 3rem;
		text-align: center;
	}
`

export const Content = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
`

export const ImageWrapper = styled.div`
	width: 75%;
	height: 8rem;
	@media (min-width: 800px) {
		height: 12rem;
	}
	img {
		border-radius: 1rem;
	}
	position: relative;
`
export const SmallImageWrapper = styled.div`
	width: 100%;
	height: 4.5rem;
	@media (min-width: 800px) {
		height: 7rem;
	}
	img {
		border-radius: 1rem;
	}
	position: relative;
`
export const TitleImageWrapper = styled.div`
	width: 70%;
`
export const ImageAndScoreWrapper = styled.div`
	display: flex;
	justify-content: start;
	align-items: center;
	width: calc(14rem + 30vw);
	max-width: min(95vw, 40rem);
`
export const LoadingMessage = styled.div`
	margin: 0.6rem;
	width: 25%;
`

export const Li = styled.li`
	> a {
		display: flex;
		flex-direction: column;
	}
`
