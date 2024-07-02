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

  getReservation() {
    return this.http
      .get(environment.apiBaserURL + '/reservations')
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  getReservationByTable(tableId: string) {
    return this.http
      .get(environment.apiBaserURL + `/reservations/table/${tableId}`)
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  createReservation(reservation: {
    tableId: number;
    name: string;
    phone: string;
    numberOfPeople: number;
  }) {
    return this.http
      .post(environment.apiBaserURL + '/reservations', reservation)
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  cancelReservation(reservationId: string | number) {
    return this.http
      .patch(environment.apiBaserURL + `/reservations/${reservationId}`, {})
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  updateReservation({
    reservationId,
    name,
    phone,
    numberOfPeople,
  }: {
    reservationId: number;
    name: string;
    phone: string;
    numberOfPeople: number;
  }) {
    return this.http
      .put(environment.apiBaserURL + `/reservations/${reservationId}`, {
        name,
        phone,
        numberOfPeople,
      })
      .pipe(catchError(this.errorHandler.handleHttpError));
  }
}
