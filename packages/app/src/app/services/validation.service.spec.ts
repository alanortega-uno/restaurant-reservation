import { TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [ValidationService],
    });
    service = TestBed.inject(ValidationService);
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('passwordMatch', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = formBuilder.group(
        {
          password: ['password123', Validators.required],
          confirmPassword: ['password123', Validators.required],
        },
        { validator: service.passwordMatch('password', 'confirmPassword') }
      );
    });

    it('should return null when passwords match', () => {
      expect(form.errors).toBeNull();
      expect(form.get('confirmPassword')?.errors).toBeNull();
    });

    it('should set passwordMismatch error when passwords do not match', () => {
      form.get('confirmPassword')?.setValue('differentPassword');
      expect(form.errors).toEqual({ passwordMismatch: true });
      expect(form.get('confirmPassword')?.errors).toEqual({
        passwordMismatch: true,
      });
    });

    it('should clear passwordMismatch error when passwords match again', () => {
      form.get('confirmPassword')?.setValue('differentPassword');
      expect(form.errors).toEqual({ passwordMismatch: true });
      expect(form.get('confirmPassword')?.errors).toEqual({
        passwordMismatch: true,
      });

      form.get('confirmPassword')?.setValue('password123');
      expect(form.errors).toBeNull();
      expect(form.get('confirmPassword')?.errors).toBeNull();
    });
  });
});
