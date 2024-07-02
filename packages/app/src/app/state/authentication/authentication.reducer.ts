import { createReducer, on } from '@ngrx/store';
import * as AuthenticationActions from './authentication.actions';

import { ApiRequestStatus } from '@restaurant-reservation/shared';

export interface AuthenticationState {
  email: string | null;
  isAdmin: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  error: any | null;
  status: ApiRequestStatus;
}

export const initialAuthenticationState: AuthenticationState = {
  email: null,
  accessToken: null,
  refreshToken: null,
  isAdmin: false,
  error: null,
  status: ApiRequestStatus.pending,
};

export const authenticationReducer = createReducer(
  initialAuthenticationState,
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
    (state, { email, isAdmin, accessToken, refreshToken }) => ({
      ...state,
      email,
      isAdmin,
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
