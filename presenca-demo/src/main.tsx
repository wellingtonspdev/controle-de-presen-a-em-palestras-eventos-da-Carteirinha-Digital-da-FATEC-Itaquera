import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import App from './App'
import './styles/global.css'

const basename = import.meta.env.BASE_URL

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
