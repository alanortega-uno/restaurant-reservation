import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  createReservation(reservation: {
    name: string;
    phone: string;
    numberOfPeople: number;
  }) {
    return this.http
      .post(environment.apiBaserURL + '/reservations', reservation)
      .pipe(catchError(this.errorHandler.handleHttpError));
  }
}
