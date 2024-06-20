import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as AuthenticationActions from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
  createAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.createAccount),
      mergeMap((action) =>
        this.authenticationService
          .createNewAccount({ email: action.email, password: action.password })
          .pipe(
            tap((response) => {
              console.log(response);
            }),
            map((response: any) => {
              if (response.error) {
                return AuthenticationActions.loginFailure({
                  error: response.error,
                });
              }

              return AuthenticationActions.loginSuccess({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              });
            }),
            catchError((error) =>
              of(AuthenticationActions.loginFailure({ error }))
            )
          )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.login),
      mergeMap((action) =>
        this.authenticationService
          .login({ email: action.email, password: action.password })
          .pipe(
            map((response: any) => {
              if (response.error) {
                return AuthenticationActions.loginFailure({
                  error: response.error,
                });
              }

              return AuthenticationActions.loginSuccess({
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              });
            }),
            catchError((error) =>
              of(AuthenticationActions.loginFailure({ error }))
            )
          )
      )
    )
  );

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.loginWithGoogle),
      mergeMap((action) =>
        this.authenticationService.loginWithGoogle(action.credentials).pipe(
          map((response: any) => {
            if (response.error) {
              return AuthenticationActions.loginFailure({
                error: response.error,
              });
            }

            return AuthenticationActions.loginSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            });
          }),
          catchError((error) =>
            of(AuthenticationActions.loginFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService
  ) {}
}
