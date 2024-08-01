import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthenticationService } from 'src/app/services/authentication.service';

import { LoginComponent } from './login.component';
import { Store } from '@ngrx/store';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({})),
      loginWithGoogle: jasmine
        .createSpy('loginWithGoogle')
        .and.returnValue(of({})),
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    const testStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: Store, useValue: testStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call loginWithGoogle if gCredentials is available in sessionStorage', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('test-credentials');
      spyOn(sessionStorage, 'removeItem');

      component.ngOnInit();

      expect(sessionStorage.getItem).toHaveBeenCalledWith('gCredentials');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('gCredentials');
      expect(authService.loginWithGoogle).toHaveBeenCalledWith(
        'test-credentials'
      );
    });

    it('should not call loginWithGoogle if gCredentials is not available in sessionStorage', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);

      component.ngOnInit();

      expect(authService.loginWithGoogle).not.toHaveBeenCalled();
    });
  });

  describe('sendLoginRequest', () => {
    it('should call login and navigate on successful login', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password',
      });

      component.sendLoginRequest();

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
      expect(router.navigate).toHaveBeenCalledWith(['reservation']);
    });

    // TODO: Write new tests for NgRx
    // it('should set apiError on login failure', () => {
    //   const mockError = { error: 'Login failed', status: 401 };
    //   authService.login.and.returnValue(of(mockError));

    //   component.loginForm.setValue({
    //     email: 'test@example.com',
    //     password: 'password',
    //   });

    //   component.sendLoginRequest();

    //   expect(component.apiError).toEqual(mockError);
    // });
  });
});
