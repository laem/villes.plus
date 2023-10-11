'use client'
import Link from 'next/link'
import styled from 'styled-components'

export const ClassementWrapper = styled.div`
	width: 100%;
	margin: 0 auto;
	padding: 0.6rem;
	h2 {
		font-size: 120%;
		font-weight: normal;
		text-align: center;
	}
	> ol {
		padding: 0;
		margin-top: 1rem;
	}

	> ol > li {
		list-style-type: none;
	}

	> ol > li > a {
		display: flex;
		justify-content: space-between;
		margin: 0.8rem 0;
	}

	li a {
		color: inherit;
	}
	/*
				li:nth-child(odd) {
					background: #eee;
				}
				*/
	a {
		font-size: 100%;
		text-decoration: none;
	}
	> small {
		text-align: center;
		display: block;
	}
`

export const NewCityLink = () => (
	<Link
		css={`
			position: fixed;
			bottom: 2vw;
			right: 2vw;
			font-size: 300%;
			background: #1e3799;
			width: 3rem;
			height: 3rem;
			line-height: 3rem;
			border-radius: 3rem;
			color: white;
			text-align: center;
		`}
		href="/recherche"
		title="Tester un autre territoire"
	>
		+
	</Link>
)

export const CounterLevel = styled.div`
	a {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	img {
		width: 2rem;
		height: auto;
		margin-right: 0.6rem;
	}
`

export const Ol = styled.ol`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0 1rem !important;
	margin-top: 6vh;
	li {
		max-width: 28rem;
		width: 100%;
		height: 20rem;
		@media (max-width: 800px) {
			height: auto;
		}
		justify-content: center;
		align-items: center;
	}
`

export const Loading = styled.p`
	font-weight: 600;
	margin-top: 3rem;
	text-align: center;
`

export const DateBlock = styled.div`
	margin: 1rem 0;
	text-align: center;
	button {
		margin-left: 0.6rem;
	}
	a {
		margin: 0 0.6rem;
	}
`
