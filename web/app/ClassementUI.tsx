'use client'
import Link from 'next/link'
import styled from 'styled-components'

export const ClassementWrapper = styled.div`
	${(props) => (props.gridView ? 'width: 100%;' : 'max-width: 45rem;')}
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
