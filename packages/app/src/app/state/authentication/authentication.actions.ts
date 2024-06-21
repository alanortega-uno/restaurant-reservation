import { createEffect } from '@ngrx/effects';
import { createAction, props } from '@ngrx/store';

export const createAccount = createAction(
  '[Auth] Create a new account',
  props<{ email: string; password: string }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginWithGoogle = createAction(
  '[Auth] Login with google',
  props<{ credentials: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ email: string; accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const clearError = createAction('[Auth] Clear error');
