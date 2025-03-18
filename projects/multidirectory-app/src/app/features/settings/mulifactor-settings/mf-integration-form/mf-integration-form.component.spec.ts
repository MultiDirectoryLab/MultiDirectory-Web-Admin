import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MfKeyValidatorDirective } from '@core/validators/mf-keys-validator.directive';
import { TranslocoModule } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { getTranslocoModule } from '@testing/transloco-testing';
import {
  ButtonComponent,
  MdFormComponent,
  TextboxComponent,
  TooltipComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { MfIntegrationFormComponent } from './mf-integration-form.component';

describe('MfIntegrationFormComponent', () => {
  let component: MfIntegrationFormComponent;
  let fixture: ComponentFixture<MfIntegrationFormComponent>;
  let apiService: jasmine.SpyObj<MultidirectoryApiService>;
  let windowsService: jasmine.SpyObj<AppWindowsService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('MultidirectoryApiService', [
      'setupMultifactor',
      'clearMultifactor',
    ]);
    windowsService = jasmine.createSpyObj('AppWindowsService', ['showSpinner', 'hideSpinner']);
    toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslocoModule,
        getTranslocoModule(),
        MfIntegrationFormComponent,
        MfKeyValidatorDirective,
        MdFormComponent,
        TextboxComponent,
        ButtonComponent,
        TooltipComponent,
      ],
      providers: [
        { provide: MultidirectoryApiService, useValue: apiService },
        { provide: AppWindowsService, useValue: windowsService },
        { provide: ToastrService, useValue: toastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MfIntegrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default scope as "http"', () => {
      expect(component.scope).toBe('http');
      expect(component.translocoSection).toBe('multifactor-settings.mf-admin-integration');
    });

    it('should update translocoSection when scope is "ldap"', () => {
      component.scope = 'ldap';
      component.ngOnInit();
      expect(component.translocoSection).toBe('multifactor-settings.mf-user-integration');
    });

    it('should initialize with empty API key and secret', () => {
      expect(component.apiKey).toBe('');
      expect(component.apiSecret).toBe('');
    });
  });

  describe('Input Validation', () => {
    xit('should validate API key and secret format', () => {
      component.apiKey = 'rs_1234567890123456789012345678x';
      component.apiSecret = '12345678901234567890123456789012';
      component.form().inputs.forEach((x) => x.control?.markAsTouched());
      component.form().validate();
      expect(component.form().valid).toBeTruthy();
    });

    it('should invalidate form with incorrect API key format', () => {
      component.apiKey = 'invalid_key';
      fixture.detectChanges();
      expect(component.form().valid).toBeFalsy();
    });
  });

  describe('Apply Function', () => {
    beforeEach(() => {
      component.apiKey = 'rs_1234567890123456789012345678x';
      component.apiSecret = '12345678901234567890123456789012';
    });

    it('should call setupMultifactor with correct parameters for HTTP scope', fakeAsync(() => {
      apiService.setupMultifactor.and.returnValue(of(true));

      component.apply();
      tick();

      expect(windowsService.showSpinner).toHaveBeenCalled();
      expect(apiService.setupMultifactor).toHaveBeenCalledWith(
        component.apiKey,
        component.apiSecret,
        false,
      );
      expect(toastrService.success).toHaveBeenCalledWith('Integration Enabled');
      expect(windowsService.hideSpinner).toHaveBeenCalled();
    }));

    it('should call setupMultifactor with correct parameters for LDAP scope', fakeAsync(() => {
      component.scope = 'ldap';
      component.ngOnInit();
      apiService.setupMultifactor.and.returnValue(of(true));

      component.apply();
      tick();

      expect(apiService.setupMultifactor).toHaveBeenCalledWith(
        component.apiKey,
        component.apiSecret,
        true,
      );
      expect(toastrService.success).toHaveBeenCalledWith('Integration Enabled');
    }));

    it('should handle API errors properly', fakeAsync(() => {
      const error = new Error('API Error');
      apiService.setupMultifactor.and.returnValue(throwError(() => error));
      try {
        component.apply();
        tick();
        expect(windowsService.showSpinner).toHaveBeenCalled();
        expect(windowsService.hideSpinner).toHaveBeenCalled();
        expect(apiService.setupMultifactor).toThrowError();
      } catch (error) {
        console.log('error', error);
      }
    }));
  });

  describe('Clear Function', () => {
    it('should clear multifactor settings successfully', fakeAsync(() => {
      apiService.clearMultifactor.and.returnValue(of(void 0));

      component.clear();
      tick();

      expect(windowsService.showSpinner).toHaveBeenCalled();
      expect(apiService.clearMultifactor).toHaveBeenCalledWith('http');
      expect(toastrService.success).toHaveBeenCalledWith('Multifactor was cleared');
      expect(component.apiKey).toBeFalsy();
      expect(component.apiSecret).toBeFalsy();
      expect(windowsService.hideSpinner).toHaveBeenCalled();
    }));

    it('should show correct success message based on scope', fakeAsync(() => {
      component.scope = 'ldap';
      component.ngOnInit();
      apiService.clearMultifactor.and.returnValue(of(void 0));

      component.clear();
      tick();

      expect(toastrService.success).toHaveBeenCalledWith('MULTIFACTOR was cleared');
    }));

    it('should reset form inputs after successful clear', fakeAsync(() => {
      apiService.clearMultifactor.and.returnValue(of(void 0));
      const input = component.form().inputs.first;
      spyOn(input, 'reset');

      component.clear();
      tick();

      expect(input.reset).toHaveBeenCalled();
      expect(component.apiKey).toBeFalsy();
      expect(component.apiSecret).toBeFalsy();
    }));
  });

  describe('UI Interaction', () => {
    it('should disable apply button when form is invalid', () => {
      component.apiKey = 'invalid_key';
      fixture.detectChanges();

      const applyButton = fixture.debugElement.query(By.css('.md-button-primary'));
      expect(applyButton.nativeElement.disabled).toBeTruthy();
    });

    xit('should enable apply button when form is valid', () => {
      component.apiKey = 'rs_1234567890123456789012345678x';
      component.apiSecret = '12345678901234567890123456789012';
      fixture.detectChanges();
      component.form().validate();
      fixture.detectChanges();
      const applyButton = fixture.debugElement.query(By.css('button.md-button-primary'));
      expect(applyButton.nativeElement.disabled).toBeFalsy();
    });

    it('should hide API secret by default', () => {
      const secretInput = fixture.debugElement.query(By.css('md-textbox[name="api-secret"]'));
      expect(secretInput.componentInstance.password).toBeTruthy();
      expect(secretInput.componentInstance.allowPasswordView).toBeFalsy();
    });
  });
});
