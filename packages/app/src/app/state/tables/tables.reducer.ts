import { createReducer, on } from '@ngrx/store';
import { Table } from '@restaurant-reservation/shared';
import {
  addTable,
  loadTables,
  loadTablesFailure,
  loadTablesSuccess,
} from './tables.actions';

import { ApiRequestStatus } from '@restaurant-reservation/shared';

// export enum ApiRequestStatus {
//   pending = 'pending',
//   loading = 'loading',
//   error = 'error',
//   success = 'success',
// }

export interface TableState {
  tables: Table[];
  error: string | null;
  status: ApiRequestStatus;
}

export const initialState: TableState = {
  tables: [],
  error: null,
  status: ApiRequestStatus.pending,
};

export const tableReducer = createReducer(
  initialState,
  on(loadTables, (state) => ({ ...state, status: ApiRequestStatus.loading })),
  on(loadTablesSuccess, (state, { tables }) => ({
    ...state,
    tables: tables,
    error: null,
    status: ApiRequestStatus.success,
  })),
  on(loadTablesFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: ApiRequestStatus.error,
  }))
);
