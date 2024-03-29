'use client'
import styled from 'styled-components'

export const Legend = styled.span`
	width: 1rem;
	height: 0.4rem;
	display: inline-block;
	vertical-align: middle;
	background: ${(props) => props.color};
`

export const SmallLegend = styled.small`
	text-align: center;
	display: block;
	margin: 0.2rem 0;
`

export const SegmentFilters = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
`

export const SegmentFilterButton = styled.button`
	margin: 0.4rem;
	background: white;
	border: 2px solid var(--color2);
	padding: 0.1rem 0.4rem;
	cursor: pointer;
	border-radius: 0.4rem;
	${(p) =>
		p.$active &&
		`
			background: var(--color2);
			color: white;
    font-weight: bold
`};
`
