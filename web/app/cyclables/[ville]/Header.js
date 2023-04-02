import { Link } from 'react-router-dom'
import Logo from '@/app/Logo'
export default ({ ville }) => (
	<header>
		<Logo color={'black'} text={ville} cyclable />
		<h2>Mon territoire est-il cyclable ?</h2>
		<p>
			Précisons : <em>vraiment</em> cyclable, donc des voies cyclables séparées
			des voitures et piétons, ou des vélorues où le vélo est prioritaire.
		</p>
		<p>
			La méthode de test : on calcule le trajet vélo le plus sécurisé entre des
			points représentatifs du territoire : mairies et sélection d'arrêts de
			bus. Pour chaque point, les trajets vers les 4 points adjacents sont
			testés. <Link to="/explications/cyclable">En savoir plus</Link>.
		</p>
	</header>
)
