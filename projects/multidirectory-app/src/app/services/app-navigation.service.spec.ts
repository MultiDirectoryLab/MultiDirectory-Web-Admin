import { take } from 'rxjs';
import { NavigationNode } from '@core/navigation/navigation-node';
import { AppNavigationService } from './app-navigation.service';
import { TestBed } from '@angular/core/testing';
import { LdapEntryNode } from '@models/core/ldap/ldap-entity';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { getTranslocoModule } from '@testing/transloco-testing';

xdescribe('NavigationServiceSuite', () => {
  let naviagtionService: AppNavigationService;
  let fixture;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: AppNavigationService, useClass: AppNavigationService },
      ],
      imports: [getTranslocoModule()],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    naviagtionService = TestBed.inject(AppNavigationService);
  });

  it('NavigationService should return root', () => {});

  it('Navigationservice should return first level consists of different types of nodes', () => {});
});
