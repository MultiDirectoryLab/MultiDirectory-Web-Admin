import { AttributeService } from './attributes.service';
import { AppNavigationService } from './app-navigation.service';
import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@testing/transloco-testing';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
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

  const getParitalAttributes = (): PartialAttribute[] => {
    return [
      { type: 'distingushedName', vals: ['firstValue', 'secondValue'] },
      { type: 'cn', vals: ['test'] },
      { type: 'fullname', vals: [] },
    ];
  };

  it('should get accessor', () => {});

  it('should track changes', () => {});

  it('should return original value', () => {});

  it('should get update request', () => {});
});
