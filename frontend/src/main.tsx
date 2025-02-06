import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MessangerApp from './MessengerApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MessangerApp />
  </StrictMode>,
)
