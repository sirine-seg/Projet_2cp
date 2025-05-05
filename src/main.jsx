import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <Router>
      <GoogleOAuthProvider clientId='746021296567-ps7a99uvjgduiic1536edgo26tajha98.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>
)