'use client'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import styled from 'styled-components'
export default () => (
	<Header>
		<Image src={logo} alt="Logo de villes.plus" />
		<h1
			css={`
				margin: 0;
				background-image: linear-gradient(90deg, #7b65e2, #af3dbb);
				background-clip: text;
				color: transparent;
			`}
		>
			Villes.plus
		</h1>
	</Header>
)

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: 4rem;
		height: auto;
		margin-right: 0.4rem;
	}
	font-size: 140%;
	margin: 2rem 0;
`
