'use client'
import styled from 'styled-components'

export const Legend = styled.span`
	width: 2rem;
	height: 0.4rem;
	display: inline-block;
	vertical-align: middle;
	background: ${(props) => props.color};
`
export const buttonCSS = `
margin: .4rem; background: white; border: 2px solid var(--color2); padding: .1rem .4rem; cursor: pointer; 
border-radius: .4rem`

export const SmallLegend = styled.small`
	text-align: center;
	display: block;
	margin-top: 0.1rem;
`
