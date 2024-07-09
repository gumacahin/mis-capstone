import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// TODO: use environment variables
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Auth0Provider
    domain="dev-tbs5lvhtbsscsnn5.us.auth0.com"
    clientId="rN7LAyREwX1U1xMm2Y9Zo7GaEgE7c1bq"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    useRefreshTokens
    cacheLocation="localstorage"
  >
    <App />
    </Auth0Provider>
  </React.StrictMode>,
)
