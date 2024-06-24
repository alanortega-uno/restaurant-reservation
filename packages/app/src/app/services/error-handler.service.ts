import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIError } from '@restaurant-reservation/shared';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleHttpError(error: HttpErrorResponse) {
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
