import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_REDIRECT_URL,
  AUTH0_AUDIENCE,
  AUTH0_SCOPE,
} from './constants/auth';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: AUTH0_REDIRECT_URL,
      audience: AUTH0_AUDIENCE,
      scope: AUTH0_SCOPE,
    }}
    cacheLocation="localstorage"
  >
    <App />
    </Auth0Provider>
  </React.StrictMode>,
)
