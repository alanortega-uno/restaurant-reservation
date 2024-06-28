import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.reducer';

export const selectAuthenticationState =
  createFeatureSelector<AuthenticationState>('authentication');

export const selectTokens = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => ({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  })
);

export const selectAuthenticationApiRequestStatus = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => ({
    status: state.status,
    error: state.error,
  })
);

export const selectAccountEmail = createSelector(
  selectAuthenticationState,
  (state: AuthenticationState) => state.email
);
