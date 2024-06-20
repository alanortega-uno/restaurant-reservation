import { createReducer, on } from '@ngrx/store';
import * as AuthenticationActions from './authentication.actions';

import { ApiRequestStatus } from '@restaurant-reservation/shared';

export interface AuthenticationState {
  id: number | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: any | null;
  status: ApiRequestStatus;
}

export const initialState: AuthenticationState = {
  id: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  status: ApiRequestStatus.pending,
};

export const authenticationReducer = createReducer(
  initialState,
  on(AuthenticationActions.createAccount, (state, { email, password }) => ({
    ...state,
    error: null,
    status: ApiRequestStatus.loading,
  })),
  on(AuthenticationActions.login, (state, { email, password }) => ({
    ...state,
    error: null,
    status: ApiRequestStatus.loading,
  })),
  on(AuthenticationActions.loginWithGoogle, (state, credentials) => ({
    ...state,
    error: null,
    status: ApiRequestStatus.loading,
  })),
  on(
    AuthenticationActions.loginSuccess,
    (state, { accessToken, refreshToken }) => ({
      ...state,
      accessToken,
      refreshToken,
      error: null,
      status: ApiRequestStatus.success,
    })
  ),
  on(AuthenticationActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    status: ApiRequestStatus.error,
  })),
  on(AuthenticationActions.clearError, (state) => ({
    ...state,
    error: null,
  }))
);
