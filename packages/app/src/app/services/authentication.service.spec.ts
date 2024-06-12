import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user', () => {
    const credentials = {
      email: 'alan.ortega@gmail.com',
      password: 'password',
    };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiBaserURL + '/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // it('should log in with Google', () => {
  //   const credentials = 'fake-google-token';
  //   const mockResponse = { token: 'fake-jwt-token' };

  //   service.loginWithGoogle(credentials).subscribe((response) => {
  //     expect(response).toEqual(mockResponse);
  //   });

  //   const req = httpMock.expectOne(environment.apiBaserURL + '/auth/google');
  //   expect(req.request.method).toBe('POST');
  //   req.flush(mockResponse);
  // });

  // it('should create a new account', () => {
  //   const credentials = { email: 'newuser@example.com', password: 'password' };
  //   const mockResponse = { token: 'fake-jwt-token' };

  //   service.createNewAccount(credentials).subscribe((response) => {
  //     expect(response).toEqual(mockResponse);
  //   });

  //   const req = httpMock.expectOne(
  //     environment.apiBaserURL + '/auth/new-account'
  //   );
  //   expect(req.request.method).toBe('POST');
  //   req.flush(mockResponse);
  // });

  // it('should handle HTTP errors', () => {
  //   const credentials = { email: 'error@example.com', password: 'password' };
  //   const mockError = new HttpErrorResponse({
  //     error: 'test 401 error',
  //     status: 401,
  //     statusText: 'Unauthorized',
  //   });

  //   service.login(credentials).subscribe((response) => {
  //     expect(response).toEqual({ error: 'test 401 error', status: 401 });
  //   });

  //   const req = httpMock.expectOne(environment.apiBaserURL + '/auth/login');
  //   req.flush('test 401 error', { status: 401, statusText: 'Unauthorized' });
  // });
});
