import { Injectable } from '@angular/core';
import { TableService } from 'src/app/services/table.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ReservationsActions from './reservations.actions';
import { catchError, map, merge, mergeMap, of, withLatestFrom } from 'rxjs';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from '@restaurant-reservation/shared';

@Injectable()
export class ReservationEffects {
  constructor(
    private actions$: Actions,
    private reservationService: ReservationService
  ) {}

  loadReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.loadReservation),
      mergeMap(() =>
        this.reservationService.getReservation().pipe(
          map((response: any) => {
            console.log('ReservationsActions.loadReservation', response);
            if (response.error) {
              return ReservationsActions.loadReservationFailure({
                error: response.error,
              });
            }

            return ReservationsActions.loadReservationSuccess({
              activeReservation: response.activeReservation,
            });
          }),
          catchError((error) =>
            of(ReservationsActions.loadReservationFailure({ error }))
          )
        )
      )
    )
  );

  makeReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.makeReservation),
      mergeMap((props) =>
        this.reservationService.createReservation(props).pipe(
          map((response: any) => {
            console.log('makeReservation Effect', response);
            if (response.error) {
              return ReservationsActions.makeReservationFailure({
                error: response.error,
              });
            }

            const reservationEntity = response.reservation;

            const reservation: Reservation = {
              id: reservationEntity.id,
              name: reservationEntity.name,
              number_of_people: reservationEntity.number_of_people,
              phone: reservationEntity.phone,
              status: reservationEntity.status,
              created_at: reservationEntity.created_at,
              updated_at: reservationEntity.updated_at,
              table: reservationEntity.table,
              account: reservationEntity.account,
            };

            return ReservationsActions.makeReservationSuccess({
              reservation,
            });
          }),
          catchError((error) =>
            of(ReservationsActions.makeReservationFailure({ error }))
          )
        )
      )
    )
  );

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.cancelReservation),
      mergeMap((props) =>
        this.reservationService.cancelReservation(props.reservationId).pipe(
          map((response: any) => {
            if (response.error) {
              return ReservationsActions.cancelReservationFailure({
                error: response.error,
              });
            }

            return ReservationsActions.cancelReservationSuccess();
          }),
          catchError((error) =>
            of(ReservationsActions.cancelReservationFailure({ error }))
          )
        )
      )
    )
  );

  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.updateReservation),
      mergeMap((props) =>
        this.reservationService.updateReservation(props).pipe(
          map((response: any) => {
            if (response.error) {
              return ReservationsActions.updateReservationFailure({
                error: response.error,
              });
            }

            console.log('updateReservation$ success', response.reservation);
            return ReservationsActions.updateReservationSuccess({
              reservation: response.reservation as Reservation,
            });
          }),
          catchError((error) =>
            of(ReservationsActions.updateReservationFailure({ error }))
          )
        )
      )
    )
  );
}
