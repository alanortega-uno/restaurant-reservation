import { createAction, props } from '@ngrx/store';
import { Table } from '@restaurant-reservation/shared';

export const addTable = createAction(
  '[Admin Table] Create table',
  props<{ name: string; capacity: number }>()
);

export const removeTable = createAction(
  '[Admin Table] Remove table',
  props<{ id: number }>()
);

export const loadTables = createAction('[Admin Table] Load tables');

export const loadTablesSuccess = createAction(
  '[Table API] Tables load success',
  props<{ tables: Table[] }>()
);

export const loadTablesFailure = createAction(
  '[Table API] Tables load failure',
  props<{ error: string }>()
);
