'use client'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import styled from 'styled-components'
export default () => (
	<Header>
		<Image src={logo} alt="Logo de villes.plus" />

		<h1>
			<span>Villes</span>
			<span css={'color: #7e69e1'}>.</span>
			<span>plus</span>
		</h1>
	</Header>
)

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: center;
	img {
		width: 3rem;
		height: auto;
	}
`
