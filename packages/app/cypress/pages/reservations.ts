export class Reservations {
  openLogoutModalConfirmButton =
    'button[data-cy="openLogoutModalConfirmButton"]';

  openLogoutMenuButton = 'button[data-cy="openLogoutMenuButton"]';
  confirmLogoutButton = 'button[data-cy="confirmLogoutButton"]';

  openMakeAReservationModalButton =
    'button[data-cy="openMakeAReservationModalButton"]:not([disabled]';

  newReservationFormNameInput = 'input[data-cy="newReservationFormNameInput"]';
  newReservationFormPhoneInput =
    'input[data-cy="newReservationFormPhoneInput"]';
  newReservationFormNumberOfPeopleInput =
    'input[data-cy="newReservationFormNumberOfPeopleInput"]';
  newReservationFormSubmitButton =
    'button[data-cy="newReservationFormSubmitButton"]';

  newReservationConfirmButton = 'button[data-cy="newReservationConfirmButton"]';

  logout() {
    cy.get(this.openLogoutMenuButton).click();
    cy.get(this.openLogoutModalConfirmButton).click();
    cy.get(this.confirmLogoutButton).click();
  }

  makeReservation(name: string, phone: string, numberOfPeople: number = 2) {
    cy.get(this.openMakeAReservationModalButton).first().click();

    cy.get(this.newReservationFormNameInput).type(name);
    cy.get(this.newReservationFormPhoneInput).type(phone);
    cy.get(this.newReservationFormNumberOfPeopleInput).clear();
    cy.get(this.newReservationFormNumberOfPeopleInput).type(
      String(numberOfPeople)
    );

    cy.get(this.newReservationFormSubmitButton).click();
    cy.get(this.newReservationConfirmButton).click();
  }
}
