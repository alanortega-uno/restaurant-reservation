import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';
import { TableEntityData } from '../../../../shared/interfaces/tables';
import { Reservation } from '@restaurant-reservation/shared';

@Injectable({
  providedIn: 'root',
})
export class TableStatusService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  updateTableStatus(
    table: TableEntityData,
    reservation?: { name: string; phone: string; numberOfPeople: number }
  ) {
    console.log('reservation', reservation);
    return this.http
      .put(environment.apiBaserURL + `/table-status/${table.id}`, {
        table,
        reservation,
      })
      .pipe(catchError(this.errorHandler.handleHttpError));
  }
}
