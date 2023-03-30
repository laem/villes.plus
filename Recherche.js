import Article from './Article'
import React, { useState, useEffect } from 'react'
import debounce from 'debounce'
import { Link } from 'react-router-dom'

export default () => (
	<Article>
		<h1>Calculer le score d'un autre territoire</h1>
		<p>
			Un autre territoire vous intéresse ? Vous pouvez le rechercher puis lancer
			le calcul.{' '}
		</p>
		<p>
			⚠️ Attention, ne lancez pas le calcul sur un trop grand territoire, comme
			une région française ou un pays, vous risqueriez de faire planter le
			serveur{' '}
		</p>
		<AutocompleteInput />
	</Article>
)

const AutocompleteInput = () => {
	const [inputValue, setInputValue] = useState('')
	const [suggestions, setSuggestions] = useState([])

	useEffect(() => {
		if (inputValue && inputValue.length >= 2) {
			getSuggestions(inputValue, setSuggestions)
		} else {
			setSuggestions([])
		}
		return () => undefined
	}, [inputValue, setSuggestions])

	return (
		<div>
			<input
				type="text"
				placeholder="Plouzané, Rennes, Rouen métropole"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				css={`
					border: 4px solid #1e37999e;
					border-radius: 0.5rem;
					width: 30rem;
					max-width: 90%;
					padding: 0.1rem 0.6rem;
					line-height: 2rem;
					font-size: 110%;
				`}
			/>
			{suggestions.length > 0 && (
				<ul className="suggestions">
					{suggestions.map((suggestion) => (
						<li key={suggestion.id}>
							<Link to={`/cyclables/${suggestion.label}?id=${suggestion.id}`}>
								{suggestion.label}
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
const getSuggestions = debounce(async (inputValue, setSuggestions) => {
	try {
		const params = {
			q: inputValue,
			featuretype: 'administrative',
			format: 'json',
			addressdetails: 1,
			limit: 5,
			extratags: 1,
		}
		const query = new URLSearchParams(params).toString()
		const response = await fetch(
			'https://nominatim.openstreetmap.org/search?' + query
		)
		const data = await response.json()

		console.log(data)
		const formattedSuggestions = data
			.filter(
				(result) =>
					['local_authority', 'administrative', 'political'].includes(
						result.type
					) && result.extratags.wikipedia
			)
			.map((result) => {
				const wikiname = result.extratags.wikipedia,
					wikititle = wikiname && wikiname.split(':')[1]
				return {
					label: wikititle,
					id: result.osm_id,
					nominame: result.display_name,
				}
			})

		setSuggestions(formattedSuggestions)
	} catch (error) {
		console.error('Error fetching suggestions:', error)
	}
}, 300)
