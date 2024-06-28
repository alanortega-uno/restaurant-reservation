import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiRequestStatus } from '@restaurant-reservation/shared';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthenticationActions from '../../state/authentication/authentication.actions';
import {
  selectAuthenticationApiRequestStatus,
  selectTokens,
} from 'src/app/state/authentication/authentication.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  gCredentials!: string | null;

  tokens$: Observable<{
    accessToken: string | null;
    refreshToken: string | null;
  }>;

  apiRequestStatus$: Observable<{ status: ApiRequestStatus; error: any }>;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store
  ) {
    this.tokens$ = this.store.select(selectTokens);

    this.tokens$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ accessToken, refreshToken }) => {
        if (accessToken && refreshToken) {
          this.router.navigate(['reservation']);
        }
      });

    this.apiRequestStatus$ = this.store.select(
      selectAuthenticationApiRequestStatus
    );
  }

  ngOnInit(): void {
    if (
      sessionStorage.getItem('accessToken') &&
      sessionStorage.getItem('refreshToken')
    ) {
      this.router.navigate(['reservation']);
    }

    this.store.dispatch(AuthenticationActions.clearError());

    this.gCredentials = sessionStorage.getItem('gCredentials');

    sessionStorage.removeItem('gCredentials');

    if (this.gCredentials) {
      this.store.dispatch(
        AuthenticationActions.loginWithGoogle({
          credentials: this.gCredentials,
        })
      );
    }
  }

  async sendLoginRequest() {
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.store.dispatch(AuthenticationActions.login({ email, password }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
