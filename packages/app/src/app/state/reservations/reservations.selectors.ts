import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReservationState } from './reservations.reducer';

export const selectTablesState =
  createFeatureSelector<ReservationState>('reservation');

export const selectReservation = createSelector(
  selectTablesState,
  (state: ReservationState) => state.activeReservation
);

export const selectReservationApiRequestStatus = createSelector(
  selectTablesState,
  (state: ReservationState) => state.status
);
