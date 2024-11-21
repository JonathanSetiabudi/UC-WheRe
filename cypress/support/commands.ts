/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
import { Chainable, CommandOriginalFn, VisitOptions } from "cypress";

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable;
      drag(subject: string, options?: Partial<Cypress.TypeOptions>): Chainable;
      dismiss(
        subject: string,
        options?: Partial<Cypress.TypeOptions>,
      ): Chainable;
      visit(
        originalFn: CommandOriginalFn,
        url: string,
        options: Partial<VisitOptions>,
      ): Chainable;
      getDataTest(dataTestSelector: string): Chainable;
    }
  }
}

Cypress.Commands.add("getDataTest", (dataTestSelector: string) => {
  return cy.get(`[data-test="${dataTestSelector}"]`);
});
