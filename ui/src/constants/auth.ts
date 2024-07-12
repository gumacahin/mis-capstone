const { PROD } = import.meta.env;

export const AUTH_CLIENT_ID = PROD
  ? "someprodsecrethere" // gitleaks: allow
  : "someothersecrethere"; // gitleaks: allow

export const AUTH_DOMAIN = PROD ? "someproddomainhere" : "somedevdomainhere";

export const AUTH0_AUDIENCE = PROD
  ? "http://todoappdev/api"
  : "https://upou-todo-dev.web.app";
