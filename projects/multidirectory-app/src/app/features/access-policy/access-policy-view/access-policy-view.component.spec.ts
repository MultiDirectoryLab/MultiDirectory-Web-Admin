import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AccessPolicyViewComponent } from './access-policy-view.component';
import { ActivatedRoute } from '@angular/router';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { AppWindowsService } from '@services/app-windows.service';
import { AppNavigationService } from '@services/app-navigation.service';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { MfaAccessEnum } from '@core/access-policy/mfa-access-enum';
import { IpRange } from '@core/access-policy/access-policy-ip-address';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { getTranslocoModule } from '@testing/transloco-testing';

xdescribe('AccessPolicyViewComponent', () => {
  let component: AccessPolicyViewComponent;
  let fixture: ComponentFixture<AccessPolicyViewComponent>;
  let windowsService: jasmine.SpyObj<AppWindowsService>;
  let apiService: MultidirectoryApiService;
  let navigationService: jasmine.SpyObj<AppNavigationService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let navigationSubject: Subject<void>;

  const mockAccessPolicy = new AccessPolicy({
    id: 1,
    name: 'Test Policy',
    ipRange: ['192.168.1.1', new IpRange({ start: '192.168.1.2', end: '192.168.1.10' })],
    groups: ['CN=TestGroup,DC=test'],
    mfaStatus: MfaAccessEnum.SelectedGroups,
    mfaGroups: ['CN=MFAGroup,DC=test'],
  });

  beforeEach(async () => {
    navigationSubject = new Subject<void>();

    windowsService = jasmine.createSpyObj('AppWindowsService', ['showSpinner', 'hideSpinner']);
    navigationService = jasmine.createSpyObj('AppNavigationService', ['getRoot'], {
      navigationRx: navigationSubject.asObservable(),
    });
    toastrService = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [AccessPolicyViewComponent],
      imports: [
        FormsModule,
        MultidirectoryUiKitModule,
        TranslocoTestingModule,
        getTranslocoModule(),
      ],
      providers: [
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: AppWindowsService, useValue: windowsService },
        { provide: AppNavigationService, useValue: navigationService },
        { provide: ToastrService, useValue: toastrService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 1 },
            },
          },
        },
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
    fixture = TestBed.createComponent(AccessPolicyViewComponent);
    apiService = TestBed.inject(MultidirectoryApiService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load access policy on init', () => {
      navigationSubject.next();
      expect(apiService.getAccessPolicy).toHaveBeenCalled();
      expect(component.accessClient).toEqual(mockAccessPolicy);
    });

    it('should format IP addresses correctly', () => {
      navigationSubject.next();
      expect(component.ipAddresses).toBe('192.168.1.1, 192.168.1.2-192.168.1.10');
    });
  });

  describe('IP address handling', () => {
    it('should parse IP addresses on blur', () => {
      component.ipAddresses = '192.168.1.1, 192.168.1.2-192.168.1.10';
      component.onIpChanged();

      expect(component.accessClient.ipRange).toEqual([
        '192.168.1.1',
        new IpRange({ start: '192.168.1.2', end: '192.168.1.10' }),
      ]);
    });

    it('should open IP list editor modal', () => {
      const modalSpy = spyOn(component.ipListEditor, 'open').and.returnValue(
        of(['192.168.1.1', new IpRange({ start: '192.168.1.2', end: '192.168.1.10' })]),
      );

      component.changeIpAdressAttribute();
      expect(modalSpy).toHaveBeenCalled();
      expect(component.ipAddresses).toBe('192.168.1.1, 192.168.1.2-192.168.1.10');
    });
  });

  describe('Group handling', () => {
    it('should show error for short group query', fakeAsync(() => {
      component.groupQuery = 'a';
      component.checkGroups();
      tick();

      expect(toastrService.error).toHaveBeenCalled();
      expect(component.availableGroups.length).toBe(0);
    }));

    it('should search for groups with valid query', fakeAsync(() => {
      component.groupQuery = 'test';
      component.checkGroups();
      tick();

      expect(apiService.search).toHaveBeenCalled();
      expect(component.availableGroups.length).toBe(1);
    }));

    it('should handle MFA groups search', fakeAsync(() => {
      component.mfaGroupsQuery = 'test';
      component.checkMfaGroups();
      tick();

      expect(apiService.search).toHaveBeenCalled();
      expect(component.availableMfaGroups.length).toBe(1);
    }));
  });

  describe('Save functionality', () => {
    it('should save access policy with current values', () => {
      component.mfaAccess = MfaAccessEnum.SelectedGroups;
      component.save();

      expect(windowsService.showSpinner).toHaveBeenCalled();
      expect(apiService.editAccessPolicy).toHaveBeenCalledWith(component.accessClient);
      expect(windowsService.hideSpinner).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should clean up on destroy', () => {
      const unsubscribeSpy = spyOn(component['_unsubscribe'], 'complete');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
