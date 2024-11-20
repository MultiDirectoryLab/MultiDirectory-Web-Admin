import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EntityAttributesComponent } from './entity-attributes.component';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapPropertiesService } from '@services/ldap-properties.service';
import { ToastrService } from 'ngx-toastr';
import { ModalInjectDirective, MultidirectoryUiKitModule, Page } from 'multidirectory-ui-kit';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { getTranslocoModule } from '@testing/transloco-testing';
import { EntityAttribute } from '@models/entity-attribute/entity-attribute';

describe('EntityAttributesComponent', () => {
  let component: EntityAttributesComponent;
  let fixture: ComponentFixture<EntityAttributesComponent>;
  let apiServiceSpy: jasmine.SpyObj<MultidirectoryApiService>;
  let ldapPropertiesServiceSpy: jasmine.SpyObj<LdapPropertiesService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let modalControlSpy: jasmine.SpyObj<ModalInjectDirective>;
  let cdrSpy: jasmine.SpyObj<ChangeDetectorRef>;

  const mockEntityDn = 'cn=test,dc=example,dc=com';
  const mockAttributes: EntityAttribute[] = [
    new EntityAttribute('cn', 'Test User', false, true),
    new EntityAttribute('mail', 'test@example.com', false, true),
    new EntityAttribute('objectClass', 'top;posixGroupGroup', false, true),
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('MultidirectoryApiService', ['search']);
    ldapPropertiesServiceSpy = jasmine.createSpyObj('LdapPropertiesService', ['loadData']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error']);
    modalControlSpy = jasmine.createSpyObj('ModalInjectDirective', ['open']);
    cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), MultidirectoryUiKitModule],
      declarations: [EntityAttributesComponent],
      providers: [
        { provide: MultidirectoryApiService, useValue: apiServiceSpy },
        { provide: LdapPropertiesService, useValue: ldapPropertiesServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ModalInjectDirective, useValue: modalControlSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();

    modalControlSpy.contentOptions = {
      accessor: {
        $entitydn: [mockEntityDn],
      },
    };

    fixture = TestBed.createComponent(EntityAttributesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load entity attributes on init', fakeAsync(() => {
      ldapPropertiesServiceSpy.loadData.and.returnValue(of(mockAttributes));

      component.ngAfterViewInit();
      tick();

      expect(ldapPropertiesServiceSpy.loadData).toHaveBeenCalledWith(mockEntityDn);
      expect(component.allRows).toEqual(mockAttributes);
    }));

    it('should show error toast if loading attributes fails', fakeAsync(() => {
      ldapPropertiesServiceSpy.loadData.and.returnValue(throwError(() => new Error()));

      component.ngAfterViewInit();
      tick();

      expect(toastrServiceSpy.error).toHaveBeenCalled();
    }));
  });

  describe('shouldRemove', () => {
    it('should remove object class', () => {});
  });
});
