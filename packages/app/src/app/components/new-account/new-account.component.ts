import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiRequestStatus } from '@restaurant-reservation/shared';
import { ValidationService } from 'src/app/services/validation.service';
import * as AuthenticationActions from '../../state/authentication/authentication.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  selectAuthenticationApiRequestStatus,
  selectTokens,
} from 'src/app/state/authentication/authentication.selectors';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
})
export class NewAccountComponent implements OnInit, OnDestroy {
  newAccountForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    passwordGroup: this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.validationService.passwordMatch(
          'password',
          'confirmPassword'
        ),
      }
    ),
  });

  tokens$: Observable<{
    accessToken: string | null;
    refreshToken: string | null;
  }>;

  apiRequestStatus$: Observable<{ status: ApiRequestStatus; error: any }>;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
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
    this.store.dispatch(AuthenticationActions.clearError());
  }

  sendNewAccountRequest() {
    const email = this.newAccountForm.value.email ?? '';
    const password = this.newAccountForm.value.passwordGroup.password ?? '';

    this.store.dispatch(
      AuthenticationActions.createAccount({ email, password })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
