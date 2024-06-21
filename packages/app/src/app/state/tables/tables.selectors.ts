import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { TableState } from './tables.reducer';

export const selectTables = (state: AppState) => state.tables;

export const selectAllTables = createSelector(
  selectTables,
  (state: TableState) => state.tables
);
