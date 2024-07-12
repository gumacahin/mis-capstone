function loginViaAuth0Ui(username: string, password: string) {
  // Login on Auth0.
  cy.origin(
    Cypress.env("auth0_domain"),
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("input#username").type(username);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
    }
  );

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should("equal", Cypress.config("baseUrl"));
}

Cypress.Commands.add("loginToAuth0", (username: string, password: string) => {
  const log = Cypress.log({
    displayName: "AUTH0 LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  loginViaAuth0Ui(username, password);

  log.snapshot("after");
  log.end();
});

function signupViaAuth0Ui(username: string, password: string) {
  // Signup on Auth0.
  cy.origin(
    Cypress.env("auth0_domain"),
    { args: { username, password } },
    ({ username, password }) => {
      // cy.findByText(/sign up/i).click();
      cy.contains("a", "Sign up").click();
      cy.get("input#email").type(username);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.contains("button[value=accept]", "Accept").click();
    }
  );

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should("equal", Cypress.config("baseUrl"));
}

Cypress.Commands.add("signupToAuth0", (username: string, password: string) => {
  const log = Cypress.log({
    displayName: "AUTH0 SIGNUP",
    message: [`🔐 Signing up | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  signupViaAuth0Ui(username, password);

  log.snapshot("after");
  log.end();
});
