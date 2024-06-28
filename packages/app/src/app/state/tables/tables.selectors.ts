import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TableState } from './tables.reducer';

export const selectTablesState = createFeatureSelector<TableState>('tables');

export const selectAllTables = createSelector(
  selectTablesState,
  (state: TableState) => state.tables
);

export const selectTableApiRequestStatus = createSelector(
  selectTablesState,
  (state: TableState) => ({
    status: state.status,
    error: state.error,
  })
);
