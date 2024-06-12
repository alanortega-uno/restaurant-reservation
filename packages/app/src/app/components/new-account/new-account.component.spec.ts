import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidationService } from 'src/app/services/validation.service';
import { NewAccountComponent } from './new-account.component';

class MockAuthenticationService {
  createNewAccount(credentials: { email: string; password: string }) {
    return of({ token: 'fake-jwt-token' });
  }
}

class MockValidationService {
  passwordMatch(password: string, confirmPassword: string) {
    return (group: any) => {
      const pass = group.controls[password];
      const confirmPass = group.controls[confirmPassword];
      if (pass.value !== confirmPass.value) {
        confirmPass.setErrors({ notMatching: true });
      } else {
        confirmPass.setErrors(null);
      }
      return null;
    };
  }
}

describe('NewAccountComponent', () => {
  let component: NewAccountComponent;
  let fixture: ComponentFixture<NewAccountComponent>;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAccountComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: ValidationService, useClass: MockValidationService },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAccountComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password fields', () => {
    const form = component.newAccountForm;
    expect(form).toBeDefined();
    expect(form.controls['email']).toBeDefined();
    expect(form.controls['passwordGroup']).toBeDefined();
    expect(form.controls['passwordGroup'].get('password')).toBeDefined();
    expect(form.controls['passwordGroup'].get('confirmPassword')).toBeDefined();
  });

  it('should make the email field required', () => {
    const email = component.newAccountForm.controls['email'];
    email.setValue('');
    expect(email.valid).toBeFalsy();
    expect(email.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.newAccountForm.controls['email'];
    email.setValue('invalid-email');
    expect(email.valid).toBeFalsy();
    expect(email.errors?.['email']).toBeTruthy();
  });

  it('should require passwords to match', () => {
    const passwordGroup = component.newAccountForm.controls['passwordGroup'];
    passwordGroup.get('password')?.setValue('password123');
    passwordGroup.get('confirmPassword')?.setValue('differentPassword');
    expect(passwordGroup.valid).toBeFalsy();
    expect(passwordGroup.errors?.['notMatching']).toBeTruthy();
  });

  it('should call authenticationService.createNewAccount on form submit', () => {
    spyOn(authService, 'createNewAccount').and.callThrough();
    const form = component.newAccountForm;
    form.controls['email'].setValue('test@example.com');
    form.controls['passwordGroup'].get('password')?.setValue('password123');
    form.controls['passwordGroup']
      .get('confirmPassword')
      ?.setValue('password123');

    component.sendNewAccountRequest();
    expect(authService.createNewAccount).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should navigate to "reservation" on successful account creation', () => {
    const form = component.newAccountForm;
    form.controls['email'].setValue('test@example.com');
    form.controls['passwordGroup'].get('password')?.setValue('password123');
    form.controls['passwordGroup']
      .get('confirmPassword')
      ?.setValue('password123');

    component.sendNewAccountRequest();
    expect(router.navigate).toHaveBeenCalledWith(['reservation']);
  });

  it('should set apiError on failed account creation', () => {
    spyOn(authService, 'createNewAccount').and.returnValue(
      throwError({ error: 'error message', status: 400 })
    );
    const form = component.newAccountForm;
    form.controls['email'].setValue('test@example.com');
    form.controls['passwordGroup'].get('password')?.setValue('password123');
    form.controls['passwordGroup']
      .get('confirmPassword')
      ?.setValue('password123');

    component.sendNewAccountRequest();
    expect(component.apiError).toEqual({ error: 'error message', status: 400 });
  });
});
