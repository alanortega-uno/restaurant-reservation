import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIError } from '@restaurant-reservation/shared';
import { environment } from 'src/environments/environment';
import { catchError, of } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient, private store: Store) {}

  getAllTables(accessToken: string) {
    return this.http
      .get(environment.apiBaserURL + '/tables', {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${accessToken}`
        ),
      })
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
