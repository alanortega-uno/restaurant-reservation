export class TableStatus {
  openLogoutModalConfirmButton =
    'button[data-cy="openLogoutModalConfirmButton"]';

  openLogoutMenuButton = 'button[data-cy="openLogoutMenuButton"]';
  confirmLogoutButton = 'button[data-cy="confirmLogoutButton"]';

  openMakeAReservationModalButton =
    'button[data-cy="openMakeAReservationModalButton"]:not([disabled]';

  reservationStatusSelect = 'select[data-cy="reservationStatusSelect"]';
  reservationFormUpdateButton = 'button[data-cy="reservationFormUpdateButton"]';
  reservationFormCloseButton = 'button[data-cy="reservationFormCloseButton"]';

  logout() {
    cy.get(this.openLogoutMenuButton).click();
    cy.get(this.openLogoutModalConfirmButton).click();
    cy.get(this.confirmLogoutButton).click();
  }

  fullFilReservation() {
    cy.get(this.openMakeAReservationModalButton).first().click();
    cy.get(this.reservationStatusSelect).select('2');
    cy.get(this.reservationFormUpdateButton).click();
    cy.get(this.reservationFormCloseButton).click();
  }

  verifyFulfilledReservation() {
    cy.get(this.openMakeAReservationModalButton).first().click();
    cy.get(this.reservationStatusSelect).should('have.value', '2');
  }
}
