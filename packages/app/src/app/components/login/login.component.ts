import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { APIError } from '@restaurant-reservation/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  apiError!: APIError;
  gCredentials!: string | null;

  sendingAPIRequest = false;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gCredentials = sessionStorage.getItem('gCredentials');

    sessionStorage.removeItem('gCredentials');

    if (this.gCredentials) {
      this.authenticationService
        .loginWithGoogle(this.gCredentials)
        .subscribe((apiResponse) => {
          if ('error' in apiResponse) {
            this.sendingAPIRequest = true;
            this.apiError = apiResponse;
            return;
          }

          this.router.navigate(['reservation']);
        });
    }
  }

  async sendLoginRequest() {
    this.sendingAPIRequest = true;
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.authenticationService
      .login({
        email,
        password,
      })
      .subscribe((apiResponse) => {
        if ('error' in apiResponse) {
          this.sendingAPIRequest = false;
          this.apiError = apiResponse;
          return;
        }

        this.router.navigate(['reservation']);
      });
  }
}
