import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { LoginComponent } from './login.component';
import * as AuthenticationActions from '../../state/authentication/authentication.actions';
import {
  selectAccount,
  selectAuthenticationApiRequestStatus,
} from 'src/app/state/authentication/authentication.selectors';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;

  let sessionStorageSpy: jasmine.Spy;

  const mockStore = {
    select: jasmine.createSpy('select').and.callFake((selector) => {
      if (selector === selectAccount) {
        return of({
          email: null,
          isAdmin: false,
          accessToken: null,
          refreshToken: null,
        });
      }
      if (selector === selectAuthenticationApiRequestStatus) {
        return of({ status: 'idle', error: null });
      }
      return of();
    }),
    dispatch: jasmine.createSpy('dispatch'),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    sessionStorageSpy = spyOn(sessionStorage, 'getItem');
    spyOn(sessionStorage, 'removeItem');

    fixture.detectChanges();
  });

  afterEach(() => {
    mockStore.dispatch.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should navigate to reservation if tokens are present in sessionStorage', () => {
      sessionStorageSpy.and.callFake((key: string) => {
        if (key === 'accessToken' || key === 'refreshToken') {
          return 'token';
        }
        return null;
      });

      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledWith(['reservation']);
    });

    it('should dispatch loginWithGoogle action if gCredentials is present', () => {
      sessionStorageSpy.and.returnValue('test-credentials');

      const action = AuthenticationActions.loginWithGoogle({
        credentials: 'test-credentials',
      });

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should dispatch clearError action on init', () => {
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AuthenticationActions.clearError()
      );
    });
  });

  describe('sendLoginRequest', () => {
    it('should dispatch login action with email and password', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password',
      });

      component.sendLoginRequest();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AuthenticationActions.login({
          email: 'test@example.com',
          password: 'password',
        })
      );
    });
  });

  describe('Form Validation', () => {
    it('should invalidate the form if email is empty', () => {
      component.loginForm.setValue({ email: '', password: 'password' });
      expect(component.loginForm.invalid).toBeTruthy();
    });

    it('should invalidate the form if password is empty', () => {
      component.loginForm.setValue({ email: 'test@example.com', password: '' });
      expect(component.loginForm.invalid).toBeTruthy();
    });

    it('should validate the form if both email and password are provided', () => {
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password',
      });
      expect(component.loginForm.valid).toBeTruthy();
    });
  });
});
