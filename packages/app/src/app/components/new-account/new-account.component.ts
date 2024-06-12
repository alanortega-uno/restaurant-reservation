import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIError } from '@restaurant-reservation/shared';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss'],
})
export class NewAccountComponent implements OnInit {
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

  apiError!: APIError;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private validationService: ValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.newAccountForm.get(['passwordGroup', 'confirmPassword']));
  }

  sendNewAccountRequest() {
    const email = this.newAccountForm.value.email ?? '';
    const password = this.newAccountForm.value.passwordGroup.password ?? '';

    this.authenticationService
      .createNewAccount({ email, password })
      .subscribe((apiResponse) => {
        if ('error' in apiResponse) {
          this.apiError = apiResponse;
          return;
        }

        this.router.navigate(['reservation']);
      });
  }
}
