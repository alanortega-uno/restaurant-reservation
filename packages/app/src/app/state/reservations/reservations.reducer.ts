import { createReducer, on } from '@ngrx/store';
import * as ReservationsActions from './reservations.actions';

import { ApiRequestStatus, Reservation } from '@restaurant-reservation/shared';

export interface ReservationState {
  activeReservation: Reservation | null;
  error: string | null;
  status: ApiRequestStatus;
}

export const initialReservationState: ReservationState = {
  activeReservation: null,
  error: null,
  status: ApiRequestStatus.pending,
};

export const reservationsReducer = createReducer(
  initialReservationState,
  on(ReservationsActions.loadReservation, (state) => ({
    ...state,
    error: null,
    status: ApiRequestStatus.loading,
  })),
  on(ReservationsActions.loadReservationByTable, (state, { tableId }) => ({
    activeReservation: null,
    error: null,
    status: ApiRequestStatus.loading,
  })),
  on(
    ReservationsActions.loadReservationSuccess,
    (state, { activeReservation }) => ({
      ...state,
      activeReservation: activeReservation,
      error: null,
      status: ApiRequestStatus.success,
    })
  ),
  on(ReservationsActions.loadReservationFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: ApiRequestStatus.error,
  })),
  on(
    ReservationsActions.makeReservation,
    (state, { tableId, name, phone, numberOfPeople }) => ({
      ...state,
      error: null,
      status: ApiRequestStatus.loading,
    })
  ),
  on(ReservationsActions.makeReservationSuccess, (state, { reservation }) => ({
    ...state,
    activeReservation: reservation,
    error: null,
    status: ApiRequestStatus.success,
  })),
  on(ReservationsActions.makeReservationFailure, (state, { error }) => ({
    ...state,
    error,
    status: ApiRequestStatus.error,
  })),
  on(ReservationsActions.cancelReservation, (state, reservationId) => ({
    ...state,
    error: null,
    status: ApiRequestStatus.loading,
  })),
  on(ReservationsActions.cancelReservationSuccess, (state) => ({
    ...state,
    activeReservation: null,
    error: null,
    status: ApiRequestStatus.success,
  })),
  on(ReservationsActions.cancelReservationFailure, (state, { error }) => ({
    ...state,
    error,
    status: ApiRequestStatus.error,
  })),
  on(
    ReservationsActions.updateReservation,
    (state, { reservationId, name, phone, numberOfPeople }) => ({
      ...state,
      error: null,
      status: ApiRequestStatus.loading,
    })
  ),
  on(
    ReservationsActions.updateReservationSuccess,
    (state, { reservation }) => ({
      ...state,
      activeReservation: reservation,
      error: null,
      status: ApiRequestStatus.success,
    })
  ),
  on(ReservationsActions.updateReservationFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: ApiRequestStatus.error,
  }))
);
