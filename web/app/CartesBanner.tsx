'use client'
import Image from 'next/image'

export default function CartesBanner() {
	return (
		<div
			css={`
				padding: 0.8rem 1rem;
				border: 1px solid #dc7c0061;
				width: fit-content;
				margin: 0 auto;
				margin-bottom: 1rem;
				max-width: 90vw;
				width: 46rem;
				border-radius: 0.4rem;
				position: relative;
				p {
					margin: 0.4rem 0;
				}
				img {
					width: 2rem;
					height: auto;
					vertical-align: middle;
					margin-right: 0.4rem;
					margin-bottom: 0.1rem;
				}
			`}
		>
			<span
				css={`
					position: absolute;
					left: -1rem;
					top: -0.6rem;
					background: gold;
					padding: 0 0.4rem;
					border-radius: 0.2rem;
					margin-right: 0.6rem;
					font-weight: bold;
					color: #855017;
					font-size: 85%;
					transform: rotate(-10deg);
				`}
			>
				📢 NOUVEAU
			</span>
			<p>
				Ici, vous trouverez les classements de références des territoires les
				plus cyclables.
			</p>
			<p>
				Pour calculer un itinéraire à pieds, à vélo ou en transports, découvez
				le nouveau projet
			</p>
			<Image
				src="https://cartes.app/logo.svg"
				width="10"
				height="10"
				alt="Logo de l'appli Cartes"
			/>
			<a
				href="https://cartes.app"
				css={`
					color: #185abd;
					text-decoration: none;
				`}
			>
				<strong>Cartes</strong>
			</a>
		</div>
	)
}
