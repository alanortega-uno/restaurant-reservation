import { createAction, props } from '@ngrx/store';
import { Reservation } from '@restaurant-reservation/shared';

export const loadReservation = createAction(
  '[Reservation API] Load active reservation'
);

export const loadReservationByTable = createAction(
  '[Reservation API] Load active reservation',
  props<{ tableId: string }>()
);

export const loadReservationSuccess = createAction(
  '[Reservation API] Load active reservation success',
  props<{ activeReservation: Reservation | null }>()
);

export const loadReservationFailure = createAction(
  '[Reservation API] Load active reservation failure',
  props<{ error: string }>()
);

export const makeReservation = createAction(
  '[Reservation API] Make reservation',
  props<{
    tableId: number;
    name: string;
    phone: string;
    numberOfPeople: number;
  }>()
);

export const makeReservationSuccess = createAction(
  '[Reservation API] Make reservation success',
  props<{ reservation: Reservation }>()
);

export const makeReservationFailure = createAction(
  '[Reservation API] Make reservation failure',
  props<{ error: string }>()
);

export const cancelReservation = createAction(
  '[Reservation API] Cancel reservation',
  props<{
    reservationId: number;
  }>()
);

export const cancelReservationSuccess = createAction(
  '[Reservation API] Cancel reservation success'
);

export const cancelReservationFailure = createAction(
  '[Reservation API] Cancel reservation failure',
  props<{ error: string }>()
);

export const updateReservation = createAction(
  '[Reservation API] Update reservation',
  props<{
    reservationId: number;
    name: string;
    phone: string;
    numberOfPeople: number;
  }>()
);

export const updateReservationSuccess = createAction(
  '[Reservation API] Update reservation success',
  props<{ reservation: Reservation }>()
);

export const updateReservationFailure = createAction(
  '[Reservation API] Update reservation failure',
  props<{ error: string }>()
);
