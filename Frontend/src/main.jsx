import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import { store } from './app/app.store.js'
import './app/App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App store={store}/>
  </StrictMode>,
)
