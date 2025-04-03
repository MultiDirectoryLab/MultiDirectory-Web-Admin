import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { TextboxComponent } from './textbox.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('TextboxComponent', () => {
  let component: TextboxComponent;
  let fixture: ComponentFixture<TextboxComponent>;
  let mockInputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, FontAwesomeModule, TextboxComponent],
      providers: [ChangeDetectorRef],
    }).compileComponents();

    fixture = TestBed.createComponent(TextboxComponent);
    component = fixture.componentInstance;

    // Mock the input element
    mockInputElement = document.createElement('input');
    component.input = new ElementRef(mockInputElement);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setFocus', () => {
    xit('should focus the input element', () => {
      spyOn(mockInputElement, 'focus');
      component.setFocus();
      expect(mockInputElement.focus).toHaveBeenCalled();
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle the passwordVisible property', () => {
      component.passwordVisible = false;
      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeTrue();

      component.togglePasswordVisibility();
      expect(component.passwordVisible).toBeFalse();
    });
  });

  describe('template bindings', () => {
    xit('should bind the label input', () => {
      component.label = 'Test Label';
      fixture.detectChanges();
      const labelElement: HTMLElement = fixture.nativeElement.querySelector('label');
      expect(labelElement.textContent).toContain('Test Label');
    });

    xit('should bind the placeholder input', () => {
      component.placeholder = 'Test Placeholder';
      fixture.detectChanges();
      expect(mockInputElement.placeholder).toBe('Test Placeholder');
    });

    xit('should toggle the input type between "password" and "text" when togglePasswordVisibility is called', () => {
      component.password = true;
      component.passwordVisible = false;
      fixture.detectChanges();

      // Initially, input type should be "password"
      expect(mockInputElement.type).toBe('password');

      component.togglePasswordVisibility();
      fixture.detectChanges();

      // After toggling, input type should be "text"
      expect(mockInputElement.type).toBe('text');
    });

    it('should display the eye icon if allowPasswordView is true', () => {
      component.password = true;
      component.allowPasswordView = true;
      fixture.detectChanges();

      const eyeIcon = fixture.nativeElement.querySelector('fa-icon');
      expect(eyeIcon).toBeTruthy();
    });

    it('should not display the eye icon if allowPasswordView is false', () => {
      component.password = true;
      component.allowPasswordView = false;
      fixture.detectChanges();

      const eyeIcon = fixture.nativeElement.querySelector('fa-icon');
      expect(eyeIcon).toBeNull();
    });
  });

  describe('autocomplete and autofocus attributes', () => {
    xit('should set autocomplete attribute to "on" if autocomplete is true', () => {
      component.autocomplete = true;
      fixture.detectChanges();
      expect(mockInputElement.autocomplete).toBe('on');
    });

    xit('should set autocomplete attribute to "off" if autocomplete is false', () => {
      component.autocomplete = false;
      fixture.detectChanges();
      expect(mockInputElement.autocomplete).toBe('off');
    });

    xit('should set autofocus attribute to true if autofocus is true', () => {
      component.autofocus = true;
      fixture.detectChanges();
      expect(mockInputElement.autofocus).toBeTrue();
    });

    it('should not set autofocus attribute if autofocus is false', () => {
      component.autofocus = false;
      fixture.detectChanges();
      expect(mockInputElement.autofocus).toBeFalse();
    });
  });
});
