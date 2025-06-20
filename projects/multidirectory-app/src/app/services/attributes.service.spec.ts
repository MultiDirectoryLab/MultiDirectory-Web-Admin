import { AttributeService } from './attributes.service';
import { AppNavigationService } from './app-navigation.service';
import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@testing/transloco-testing';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { ActivatedRoute } from '@angular/router';
import { getActivatedRouteMock } from '@testing/activated-route-mock';

describe('Attributes Test Service', () => {
  let attributeService: AttributeService;
  let naviagtionService: AppNavigationService;

  beforeEach(async () => {
    attributeService = new AttributeService();

    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: ActivatedRoute, useValue: getActivatedRouteMock() },
        { provide: AppNavigationService, useClass: AppNavigationService },
      ],
      imports: [getTranslocoModule()],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    naviagtionService = TestBed.inject(AppNavigationService);
  });

  const getParitalAttributes = (): LdapAttribute[] => {
    return [
      { type: 'distingushedName', vals: ['firstValue', 'secondValue'] },
      { type: 'cn', vals: ['test'] },
      { type: 'fullname', vals: [] },
    ];
  };

  it('should get accessor', () => {
    naviagtionService.getRoot().subscribe((node) => {
      const LdapAttributes = getParitalAttributes();
      const attributes = new LdapAttributes(LdapAttributes);
      const accessor = attributeService.getTrackableAttributes(node[0], attributes);
      expect(accessor).toBeTruthy();
    });
  });

  it('should track changes', () => {
    naviagtionService.getRoot().subscribe((node) => {
      const LdapAttributes = getParitalAttributes();
      const attributes = new LdapAttributes(LdapAttributes);
      const accessor = attributeService.getTrackableAttributes(node[0], attributes);
      accessor.cn = ['test2'];
      accessor.last_name = ['value'];
      expect(accessor).toBeTruthy();
      const changes = attributeService.getChanges(accessor);
      const cn_change = changes.find((x) => x.attribute.type == 'cn');
      expect(cn_change).toBeTruthy();
      expect(cn_change!.attribute.vals[0]).toMatch('test2');
      expect(cn_change!.operation == LdapOperation.Replace);

      it('should return original value', () => {});

      const fullname_change = changes.find((x) => x.attribute.type == 'fullname');
      expect(fullname_change).toBeTruthy();
      expect(fullname_change!.operation == LdapOperation.Delete);
    });
  });

  it('should return original value', () => {
    naviagtionService.getRoot().subscribe((node) => {
      const LdapAttributes = getParitalAttributes();
      const attributes = new LdapAttributes(LdapAttributes);
      const accessor = attributeService.getTrackableAttributes(node[0], attributes);
      accessor.cn = ['test2'];
      expect(accessor).toBeTruthy();
      const changes = attributeService.getChanges(accessor);
      const cn_change = changes.find((x) => x.attribute.type == 'cn');
      expect(cn_change).toBeTruthy();
      expect(cn_change!.attribute.vals[0]).toMatch('test2');
      expect(cn_change!.operation == LdapOperation.Replace);

      const originalValue = accessor['$cn'];
      expect(originalValue).toMatch('test');
    });
  });

  it('should get update request', () => {
    naviagtionService.getRoot().subscribe((node) => {
      const LdapAttributes = getParitalAttributes();
      const attributes = new LdapAttributes(LdapAttributes);
      const accessor = attributeService.getTrackableAttributes(node[0], attributes);
      accessor.cn = ['test2'];
      const updateRequest = attributeService.createAttributeUpdateRequest(accessor);
      expect(updateRequest.object).toMatch(node[0].id);
      const cnChange = updateRequest.changes.find((x) => x.modification.type == 'cn');
      expect(cnChange?.operation).toBe(LdapOperation.Replace as number);
      expect(cnChange?.modification.vals?.[0]).toBe('test2');
    });
  });
});
