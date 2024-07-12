import { defineConfig } from "cypress";

const AUTH0_USERNAME = "mvalviar+todo-app-cypress-tester@gmail.com";
const AUTH0_PASSWORD = "CypressTest123!";
const AUTH0_CLIENT_SECRET =
  "s2rxmiT58nmOdotQhMz4E2DBasx35iNiflsy-J3vTR4jGPAiq_5EzhhLGgGwDkeW";
// const AUTH0_REDIRECT_URL = Cypress.config('baseUrl');
const REACT_APP_AUTH0_DOMAIN = "dev-tbs5lvhtbsscsnn5.us.auth0.com";
const REACT_APP_AUTH0_AUDIENCE = "http://todoappdev/api";
const REACT_APP_AUTH0_SCOPE = "";
const REACT_APP_AUTH0_CLIENTID = "rN7LAyREwX1U1xMm2Y9Zo7GaEgE7c1bq";
const REACT_APP_BASE_URL = "http://localhost:5173/";

// Populate process.env with values from .env file
// TODO: Use env vars
// require('dotenv').config()

export default defineConfig({
  env: {
    auth0_username: AUTH0_USERNAME,
    auth0_password: AUTH0_PASSWORD,
    auth0_domain: REACT_APP_AUTH0_DOMAIN,
    auth0_audience: REACT_APP_AUTH0_AUDIENCE,
    auth0_scope: REACT_APP_AUTH0_SCOPE,
    auth0_client_id: REACT_APP_AUTH0_CLIENTID,
    auth0_client_secret: AUTH0_CLIENT_SECRET,
  },
  e2e: {
    baseUrl: REACT_APP_BASE_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
