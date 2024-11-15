import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  EntityAttributesComponent,
  EntityAttribute,
  AttributeFilter,
} from './entity-attributes.component';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapPropertiesService } from '@services/ldap-properites.service';
import { ToastrService } from 'ngx-toastr';
import { ModalInjectDirective, MultidirectoryUiKitModule, Page } from 'multidirectory-ui-kit';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SearchResponse } from '@models/entry/search-response';
import { getTranslocoModule } from '@testing/transloco-testing';

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
  /*
  describe('filtering', () => {
    beforeEach(() => {
      component.allRows = mockAttributes;
    });

    it('should filter by search text', () => {
      component.searchFilter = 'test';
      
      expect(component.rows.length).toBe(2); // Both items contain 'test'
      
      component.searchFilter = 'mail';
      expect(component.rows.length).toBe(1);
    });

    it('should filter by values when showWithValuesOnly is true', () => {
      component.filter.showWithValuesOnly = true;
      component.onFilterChange();
      
      expect(component.rows.length).toBe(2); // Both have values
      
      component.allRows.push(new EntityAttribute('empty', '', false, true));
      component.onFilterChange();
      expect(component.rows.length).toBe(2); // Empty value filtered out
    });

    it('should filter by writable when showWritableOnly is true', () => {
      component.filter.showWritableOnly = true;
      component.allRows = [
        new EntityAttribute('writable', 'value', false, true),
        new EntityAttribute('readonly', 'value', false, false)
      ];
      
      component.onFilterChange();
      expect(component.rows.length).toBe(1);
    });
  });

  describe('attribute editing', () => {
    const mockSchema = {
      search_result: [{
        partial_attributes: [{
          type: 'attributeTypes',
          vals: ["( 2.5.4.3 NAME 'cn' SYNTAX '1.3.6.1.4.1.1466.115.121.1.15' )"]
        }]
      }]
    } as SearchResponse;

    beforeEach(() => {
      apiServiceSpy.search.and.returnValue(of(mockSchema));
      modalControlSpy.open.and.returnValue(of('New Value'));
    });

    it('should handle edit click with selected attribute', fakeAsync(() => {
      component.propGrid = { selected: [mockAttributes[0]] } as any;
      
      component.onEditClick();
      tick();

      expect(apiServiceSpy.search).toHaveBeenCalled();
      expect(modalControlSpy.open).toHaveBeenCalled();
    }));

    it('should show error when no attribute is selected', () => {
      component.propGrid = { selected: [] } as any;
      
      component.onEditClick();
      
      expect(toastrServiceSpy.error).toHaveBeenCalled();
    });

    it('should update attribute value after successful edit', fakeAsync(() => {
      component.propGrid = { selected: [mockAttributes[0]] } as any;
      component.rows = [...mockAttributes];
      
      component.onEditClick();
      tick();

      expect(component.rows[0].val).toBe('New Value');
      expect(component.rows[0].changed).toBeTrue();
      expect(cdrSpy.detectChanges).toHaveBeenCalled();
    }));
  });

  describe('attribute deletion', () => {
    it('should delete selected attribute', () => {
      const attributeToDelete = mockAttributes[0];
      component.propGrid = { selected: [attributeToDelete] } as any;
      component.rows = [...mockAttributes];
      component.allRows = [...mockAttributes];
      
      component.onDeleteClick();

      expect(component.rows.length).toBe(1);
      expect(component.allRows.length).toBe(1);
      expect(component.rows.find(attr => attr.name === attributeToDelete.name)).toBeUndefined();
    });

    it('should show error when no attribute is selected for deletion', () => {
      component.propGrid = { selected: [] } as any;
      
      component.onDeleteClick();
      
      expect(toastrServiceSpy.error).toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should update page correctly', () => {
      const newPage = { pageNumber: 2, size: 20, totalElements: 40 } as Page;
      component.allRows = Array(40).fill(mockAttributes[0]);
      
      component.onPageChanged(newPage);

      expect(component.page.pageNumber).toBe(2);
      expect(component.rows.length).toBeGreaterThan(0);
      expect(cdrSpy.detectChanges).toHaveBeenCalled();
    });
  });
*/
});
