import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { APIError } from '@restaurant-reservation/shared';
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

  describe('#login, #loginWithGoogle, #createNewAccount', () => {
    it('should return an APIError on HTTP error', () => {
      const mockError: APIError = {
        error: {
          message: 'Send email and password',
        },
        status: 400,
      };
      const credentials = { email: 'test@example.com', password: 'password' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockError);
      });

      const req = httpMock.expectOne(`${environment.apiBaserURL}/auth/login`);
      expect(req.request.method).toBe('POST');

      req.flush(
        {
          message: 'Send email and password',
        },
        {
          status: 400,
          statusText: 'Bad Request',
        }
      );
    });
  });
});
