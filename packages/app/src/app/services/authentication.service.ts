import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        environment.apiBaserURL + '/auth/login',
        credentials
      )
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  loginWithGoogle(credentials: string) {
    return this.http
      .post(environment.apiBaserURL + '/auth/google', { credentials })
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  createNewAccount(credentials: { email: string; password: string }) {
    return this.http
      .post(environment.apiBaserURL + '/auth/new-account', credentials)
      .pipe(catchError(this.errorHandler.handleHttpError));
  }
}
