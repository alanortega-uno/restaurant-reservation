export class Login {
  inputEmail = 'input[data-cy="email"]';
  inputPassword = 'input[data-cy="password"]';
  buttonLogin = 'button[data-cy="login"]';
  pageTitle = '[data-cy="pageTitle"]';
  userType = '[data-cy="userType"]';

  loginForm = 'form[data-cy="loginForm"]';

  visit() {
    cy.visit('/login');
  }

  signIn(email: string, password: string) {
    cy.get(this.inputEmail).type(email);
    cy.get(this.inputPassword).type(password);

    cy.get(this.buttonLogin).click();
  }

  verifyUserLogin() {
    cy.get(this.pageTitle).should('have.text', 'Reservations');
    cy.get(this.userType).should('have.text', 'Account');
  }

  verifyAdminLogin() {
    cy.get(this.userType).should('have.text', 'Admin');
  }

  verifyLogout() {
    cy.get(this.loginForm).should('exist');
  }
}
