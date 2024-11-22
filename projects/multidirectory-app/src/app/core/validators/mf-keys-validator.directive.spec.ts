import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MfKeyValidatorDirective } from './mf-keys-validator.directive';
import { getTranslocoModule } from '@testing/transloco-testing';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <input [formControl]="control" appMfKeyValidator [isSecret]="isSecret" /> `,
})
class TestComponent {
  control = new FormControl('');
  isSecret = false;
}

describe('MfKeyValidatorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: MfKeyValidatorDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, MfKeyValidatorDirective],
      imports: [FormsModule, ReactiveFormsModule, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    // Get directive instance
    const directiveEl = fixture.debugElement.query(By.directive(MfKeyValidatorDirective));
    directive = directiveEl.injector.get(MfKeyValidatorDirective);

    fixture.detectChanges();
  });

  describe('Key Validation', () => {
    it('should validate correct key format', () => {
      const control = new FormControl('rs_1234567890123456789012345678x');
      const result = directive.validate(control);
      expect(result).toBeNull();
    });

    it('should fail for invalid key format', () => {
      const control = new FormControl('invalid_key');
      component.isSecret = true;
      const result = directive.validate(control);
      expect(result).toBeTruthy();
      expect(Object.keys(result!)).toContain('MfKeyFormat');
    });

    it('should fail for key with incorrect length', () => {
      const control = new FormControl('rs_12345'); // Too short
      const result = directive.validate(control);
      expect(result).toBeTruthy();
      expect(Object.keys(result!)).toContain('MfKeyFormat');
    });

    it('should fail for key with invalid prefix', () => {
      const control = new FormControl('rx_1234567890123456789012345678x');
      const result = directive.validate(control);
      expect(result).toBeTruthy();
      expect(Object.keys(result!)).toContain('MfKeyFormat');
    });

    it('should validate key case-insensitively', () => {
      const control = new FormControl('RS_1234567890123456789012345678X');
      const result = directive.validate(control);
      expect(result).toBeNull();
    });
  });

  describe('Secret Validation', () => {
    beforeEach(() => {
      directive.isSecret = true;
    });

    it('should validate correct secret format', () => {
      const control = new FormControl('12345678901234567890123456789012');
      const result = directive.validate(control);
      expect(result).toBeNull();
    });

    it('should fail for invalid secret format', () => {
      const control = new FormControl('invalid_secret');
      const result = directive.validate(control);
      expect(result).toBeTruthy();
      expect(Object.keys(result!)).toContain('MfKeyFormat');
    });

    it('should fail for secret with incorrect length', () => {
      const control = new FormControl('123456'); // Too short
      const result = directive.validate(control);
      expect(result).toBeTruthy();
      expect(Object.keys(result!)).toContain('MfKeyFormat');
    });

    it('should validate secret with mixed case alphanumeric characters', () => {
      const control = new FormControl('aB1cD2eF3gH4siJ5kL6mN7oP8qR9sT0x');
      const result = directive.validate(control);
      expect(result).toBeNull();
    });
  });
});
