class Login {
  visit() {
    cy.visit('/login');
  }

  signIn(email: string, password: string) {
    cy.get('#mail').type(email);
    cy.get('#password').type(password);
  }
}
