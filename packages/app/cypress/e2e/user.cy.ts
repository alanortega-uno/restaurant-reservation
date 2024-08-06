import { resetDB } from 'cypress/support/e2e';
import { Login } from '../pages/login';
import { Reservations } from 'cypress/pages/reservations';

describe('User', () => {
  const login = new Login();
  const reservations = new Reservations();

  before(() => {
    resetDB();
  });

  it('Login', () => {
    login.visit();
    login.signIn('test@tests.com', 'password');
    login.verifyUserLogin();
  });

  it('Logout', () => {
    login.visit();
    login.signIn('test@tests.com', 'password');

    reservations.logout();
    login.verifyLogout();
  });

  it('Make a reservation', () => {
    login.visit();
    login.signIn('test@tests.com', 'password');

    reservations.makeReservation('Alan Ortega', '75906713');
    login.verifyLogout();
  });
});
