/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('F00-user-registration', () => {
  beforeEach(() => {
    // TODO: possibly add these
    // cy.task('db:seed')
    // cy.intercept('POST', '/graphql').as('createBankAccount')
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('/')
    cy.findByText(/log in/i).click();
  })

  // IMPORTANT: you need to remove this user first fo this to work.
  // TODO: Try to check for the error in the auth0 login page indicting that
  // this account aleready exists. That should be enough to satisfy this test.
  // Also requires seeding the db.
  it('UC-00: User registration', () => {
    cy.signupToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
  })

  it('UC-01: User login', function () {
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
  })

  // NOTE: technically this covers login and logout
  // which is why UC-01 above is commented out.
  // FIXME: not documented in the spec yet
  it('UC-04: User logout', function () {
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
    cy.findByLabelText('Account settings').click();
    cy.findByText(/logout/i).click();
  })

  // it.todo('UC-02: Reset password', () => {
  // });
})
