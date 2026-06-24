// Entry point — mounts the React app into <div id="root"> in index.html.
// Fonts (Barlow Condensed, Inter) are loaded via <link> tags in index.html.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './util/leafletSetup'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
