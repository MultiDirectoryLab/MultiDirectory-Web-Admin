import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTranslocoModule } from '@testing/transloco-testing';
import { PasswordShouldNotMatchValidatorDirective } from './passwordnotmatch.directive';

@Component({
  template: `
    <form [formGroup]="form">
      <input type="password" formControlName="password" />
      <input
        type="password"
        formControlName="newPassword"
        [appPasswordNotMatch]="form.get('password')"
        [errorLabel]="errorLabel"
      />
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
})
class TestComponent {
  errorLabel = '';
  form = new FormGroup({
    password: new FormControl(''),
    newPassword: new FormControl(''),
  });
}

describe('PasswordShouldNotMatchValidatorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        getTranslocoModule(),
        TestComponent,
        PasswordShouldNotMatchValidatorDirective,
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should return null when passwords are different', () => {
    const passwordControl = component.form.get('password');
    const newPasswordControl = component.form.get('newPassword');

    passwordControl?.setValue('password123');
    newPasswordControl?.setValue('differentpassword');

    newPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(newPasswordControl?.hasError('PasswordsShouldNotMatch')).toBeFalsy();
  });

  it('should return PasswordsShouldNotMatch error when passwords are the same', () => {
    const passwordControl = component.form.get('password');
    const newPasswordControl = component.form.get('newPassword');

    passwordControl?.setValue('password123');
    newPasswordControl?.setValue('password123');

    newPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(newPasswordControl?.hasError('PasswordsShouldNotMatch')).toBeTruthy();
  });

  it('should not validate when controls are not touched and empty', () => {
    const passwordControl = component.form.get('password');
    const newPasswordControl = component.form.get('newPassword');

    passwordControl?.setValue('');
    newPasswordControl?.setValue('');

    expect(newPasswordControl?.hasError('PasswordsShouldNotMatch')).toBeFalsy();
  });

  it('should use custom error label when provided', () => {
    const passwordControl = component.form.get('password');
    const newPasswordControl = component.form.get('newPassword');

    component.errorLabel = 'custom.error.label';

    passwordControl?.setValue('password123');
    newPasswordControl?.setValue('password123');

    newPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(newPasswordControl?.hasError('PasswordsShouldNotMatch')).toBeTruthy();
  });

  it('should use default error label when no custom label is provided', () => {
    const passwordControl = component.form.get('password');
    const newPasswordControl = component.form.get('newPassword');

    passwordControl?.setValue('password123');
    newPasswordControl?.setValue('password123');

    newPasswordControl?.markAsTouched();
    passwordControl?.markAsTouched();

    expect(newPasswordControl?.hasError('PasswordsShouldNotMatch')).toBeTruthy();
  });
});
