import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIError } from '@restaurant-reservation/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        environment.apiBaserURL + '/auth/login',
        credentials
      )
      .pipe(catchError(this.handleHttpError));
  }

  loginWithGoogle(credentials: string) {
    return this.http
      .post(environment.apiBaserURL + '/auth/google', { credentials })
      .pipe(catchError(this.handleHttpError));
  }

  createNewAccount(credentials: { email: string; password: string }) {
    return this.http
      .post(environment.apiBaserURL + '/auth/new-account', credentials)
      .pipe(catchError(this.handleHttpError));
  }

  // TODO: abstract it to share it.
  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    const apiError: APIError = {
      error: error.error,
      statusCode: error.status,
    };

    return of(apiError);
  }
}
