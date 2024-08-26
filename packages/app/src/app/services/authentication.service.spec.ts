import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { APIError } from '@restaurant-reservation/shared';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService],
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should log in with the correct credentials', () => {
      const credentials = { email: 'test@test.com', password: 'password' };

      const loginRequestResponse = {
        email: credentials.email,
        isAdmin: false,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(loginRequestResponse);
      });

      const requestTest = httpMock.expectOne(
        environment.apiBaserURL + '/api/auth/login'
      );

      expect(requestTest.request.method).toEqual('POST');

      requestTest.flush(loginRequestResponse);
    });

    it('should log in with google', () => {
      const credentials = 'this-is-a-credential-mock';

      const loginRequestResponse = {
        email: 'test@test.com',
        isAdmin: false,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      service.loginWithGoogle(credentials).subscribe((response) => {
        expect(response).toEqual(loginRequestResponse);
      });

      const requestTest = httpMock.expectOne(
        environment.apiBaserURL + '/api/auth/google'
      );

      expect(requestTest.request.method).toEqual('POST');

      requestTest.flush(loginRequestResponse);
    });

    it('should create an account', () => {
      const credentials = { email: 'test@test.com', password: 'password' };

      const loginRequestResponse = {
        email: credentials.email,
        isAdmin: false,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      service.createNewAccount(credentials).subscribe((response) => {
        expect(response).toEqual(loginRequestResponse);
      });

      const requestTest = httpMock.expectOne(
        environment.apiBaserURL + '/api/auth/new-account'
      );

      expect(requestTest.request.method).toEqual('POST');

      requestTest.flush(loginRequestResponse);
    });
  });
});
