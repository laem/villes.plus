import { createRoot } from 'react-dom/client'
import App from './App'

let anchor = document.querySelector('#app')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
