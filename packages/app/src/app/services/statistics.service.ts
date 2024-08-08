import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getThisWeekReservationData() {
    return this.http
      .get(environment.apiBaserURL + '/api/statistics/this-week')
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  getThisMonthReservationData() {
    return this.http
      .get(environment.apiBaserURL + '/api/statistics/this-month')
      .pipe(catchError(this.errorHandler.handleHttpError));
  }

  getCustomDateRangeReservationData(startDate: string, endDate: string) {
    return this.http
      .get(
        environment.apiBaserURL +
          `/api/statistics/custom/${startDate}/${endDate}`
      )
      .pipe(catchError(this.errorHandler.handleHttpError));
  }
}
