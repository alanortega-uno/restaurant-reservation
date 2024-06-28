import { createReducer, on } from '@ngrx/store';
import { TableEntityData } from '@restaurant-reservation/shared';
import {
  loadTables,
  loadTablesFailure,
  loadTablesSuccess,
} from './tables.actions';

import { ApiRequestStatus } from '@restaurant-reservation/shared';
export interface TableState {
  tables: TableEntityData[];
  error: string | null;
  status: ApiRequestStatus;
}

export const initialTableState: TableState = {
  tables: [],
  error: null,
  status: ApiRequestStatus.pending,
};

export const tableReducer = createReducer(
  initialTableState,
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
