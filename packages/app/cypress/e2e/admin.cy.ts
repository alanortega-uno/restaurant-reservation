import { resetDB } from 'cypress/support/e2e';
import { Login } from '../pages/login';
import { Reservations } from 'cypress/pages/reservations';
import { TableStatus } from 'cypress/pages/tableStatus';

describe('Admin', () => {
  const login = new Login();
  const reservations = new Reservations();
  const tableStatus = new TableStatus();

  before(() => {
    resetDB();
  });

  it('Login', () => {
    login.visit();
    login.signIn('admin@admin.com', 'password');
    login.verifyAdminLogin();
  });

  it('Logout', () => {
    login.visit();
    login.signIn('admin@admin.com', 'password');

    reservations.logout();
    login.verifyLogout();
  });

  it('Fulfill a reservation', () => {
    login.visit();
    login.signIn('test@tests.com', 'password');

    reservations.makeReservation('Alan Ortega', '75906713');
    login.verifyLogout();

    login.signIn('admin@admin.com', 'password');

    tableStatus.fullFilReservation();

    tableStatus.logout();

    login.signIn('admin@admin.com', 'password');

    tableStatus.verifyFulfilledReservation();
  });
});
