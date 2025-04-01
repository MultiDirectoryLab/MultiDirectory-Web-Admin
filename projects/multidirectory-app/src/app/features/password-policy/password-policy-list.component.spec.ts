import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { PasswordPolicyListComponent } from './password-policy-list.component';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { getMockModalInjectDirective } from '@testing/modal-inject-testing';
import { ModalInjectDirective, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

let component: PasswordPolicyListComponent;
let fixture: ComponentFixture<PasswordPolicyListComponent>;
let mockApiService: jasmine.SpyObj<MultidirectoryApiService>;
let mockRouter: jasmine.SpyObj<Router>;
let mockAppWindowsService: jasmine.SpyObj<AppWindowsService>;
describe('PasswordPolicyListComponent', () => {
  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('MultidirectoryApiService', [
      'getPasswordPolicy',
      'deletePasswordPolicy',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAppWindowsService = jasmine.createSpyObj('AppWindowsService', [
      'showSpinner',
      'hideSpinner',
    ]);

    await TestBed.configureTestingModule({
      imports: [MultidirectoryUiKitModule, PasswordPolicyListComponent],
      providers: [
        { provide: MultidirectoryApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: AppWindowsService, useValue: mockAppWindowsService },
        {
          provide: ModalInjectDirective,
          useFactory: () => getMockModalInjectDirective({}),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPolicyListComponent);
    component = fixture.componentInstance;

    // Access the mock directive
    component.appCratePolicyModal = TestBed.inject(ModalInjectDirective);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddClick', () => {
    it('should open the modal', () => {
      component.onAddClick();
      expect(component.appCratePolicyModal?.open).toHaveBeenCalledWith({});
    });
  });

  describe('ngOnInit', () => {
    it('should load password policies and hide spinner', () => {
      const mockPasswordPolicy = new PasswordPolicy({
        id: 1,
        name: 'Test Policy',
        enforcePasswordHistory: 5,
        maximumPasswordAge: 60,
      });
      mockApiService.getPasswordPolicy.and.returnValue(of(mockPasswordPolicy));

      component.ngOnInit();

      expect(mockAppWindowsService.showSpinner).toHaveBeenCalled();
      expect(mockApiService.getPasswordPolicy).toHaveBeenCalled();
      expect(component.clients).toEqual([mockPasswordPolicy]);
      expect(mockAppWindowsService.hideSpinner).toHaveBeenCalled();
    });
  });

  describe('onDeleteClick', () => {
    it('should delete a password policy and refresh the list', () => {
      const mockPasswordPolicy = new PasswordPolicy({
        id: 1,
        name: 'Test Policy',
      });
      const refreshedPolicy = new PasswordPolicy({
        id: 2,
        name: 'Refreshed Policy',
      });

      component.clients = [mockPasswordPolicy];
      mockApiService.deletePasswordPolicy.and.returnValue(of(false));
      mockApiService.getPasswordPolicy.and.returnValue(of(refreshedPolicy));

      component.onDeleteClick(mockPasswordPolicy);

      expect(mockApiService.deletePasswordPolicy).toHaveBeenCalled();
      expect(mockApiService.getPasswordPolicy).toHaveBeenCalled();
      expect(component.clients).toEqual([refreshedPolicy]);
    });

    it('should do nothing if client has no id', () => {
      const mockPasswordPolicy = new PasswordPolicy({
        id: undefined,
        name: 'Invalid Policy',
      });

      component.clients = [mockPasswordPolicy];

      component.onDeleteClick(mockPasswordPolicy);

      expect(mockApiService.deletePasswordPolicy).not.toHaveBeenCalled();
      expect(mockApiService.getPasswordPolicy).not.toHaveBeenCalled();
      expect(component.clients).toEqual([mockPasswordPolicy]);
    });
  });

  describe('onEditClick', () => {
    it('should navigate to edit page with the correct ID', () => {
      const mockPasswordPolicy = new PasswordPolicy({
        id: 1,
        name: 'Test Policy',
      });

      component.onEditClick(mockPasswordPolicy);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['password-policy', 1]);
    });
  });

  describe('onAddClick', () => {
    it('should open the modal', () => {
      component.onAddClick();

      expect(component.appCratePolicyModal?.open).toHaveBeenCalledWith({});
    });
  });
});
