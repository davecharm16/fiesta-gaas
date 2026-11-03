import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { registerSW } from 'virtual:pwa-register'
import './index.css'

// New build available: activate it and reload so returning visitors never sit on a stale UI.
const updateSW = registerSW({ immediate: true, onNeedRefresh: () => updateSW(true) })

createRoot(document.getElementById('root')!).render(<StrictMode><HashRouter><App /></HashRouter></StrictMode>)
