import { Injectable } from '@angular/core';
import { TableService } from 'src/app/services/table.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TablesActions from './tables.actions';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthenticationSelectors from 'src/app/state/authentication/authentication.selectors';

@Injectable()
export class TableEffects {
  constructor(
    private actions$: Actions,
    private tableService: TableService,
    private store: Store
  ) {}

  tables$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TablesActions.loadTables),
      withLatestFrom(this.store.select(AuthenticationSelectors.selectTokens)),
      mergeMap(([action, tokens]) => {
        const { accessToken } = tokens;
        return this.tableService.getAllTables(accessToken ?? '').pipe(
          map(
            (response: any) => {
              console.log('[table.effects] response', response);
              if (response.error) {
                return TablesActions.loadTablesFailure({
                  error: response.error,
                });
              }

              return TablesActions.loadTablesSuccess({
                tables: response.tables,
              });
            },
            catchError((error) =>
              of(TablesActions.loadTablesFailure({ error }))
            )
          )
        );
      })
    )
  );
}
