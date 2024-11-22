import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTranslocoModule } from '@testing/transloco-testing';
import { PasswordMatchValidatorDirective } from './passwordmatch.directive';

@Component({
  template: `
    <form [formGroup]="form">
      <input type="password" formControlName="password" />
      <input
        type="password"
        formControlName="confirmPassword"
        [appPasswordMatch]="form.get('password')"
        [passwordMatchErrorLabel]="errorLabel"
      />
    </form>
  `,
})
class TestComponent {
  errorLabel = '';
  form = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
}

describe('PasswordMatchValidatorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, getTranslocoModule()],
      declarations: [TestComponent, PasswordMatchValidatorDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return null when passwords match', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');

    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('password123');

    confirmPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(confirmPasswordControl?.hasError('PasswordsDoNotMatch')).toBeFalsy();
  });

  it('should return PasswordsDoNotMatch error when passwords do not match', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');

    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('differentpassword');

    confirmPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(confirmPasswordControl?.hasError('PasswordsDoNotMatch')).toBeTruthy();
  });

  it('should not validate when controls are not touched and empty', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');

    passwordControl?.setValue('');
    confirmPasswordControl?.setValue('');

    expect(confirmPasswordControl?.hasError('PasswordsDoNotMatch')).toBeFalsy();
  });

  it('should use custom error label when provided', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');

    component.errorLabel = 'custom.error.label';

    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('differentpassword');

    confirmPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(confirmPasswordControl?.hasError('PasswordsDoNotMatch')).toBeTruthy();
  });

  it('should use default error label when no custom label is provided', () => {
    const passwordControl = component.form.get('password');
    const confirmPasswordControl = component.form.get('confirmPassword');

    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('differentpassword');

    confirmPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(confirmPasswordControl?.hasError('PasswordsDoNotMatch')).toBeTruthy();
  });
});
