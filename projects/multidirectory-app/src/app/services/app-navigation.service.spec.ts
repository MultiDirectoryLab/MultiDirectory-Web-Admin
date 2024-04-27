import { of, take } from 'rxjs';
import { NavigationNode } from '@core/navigation/navigation-node';
import { AppNavigationService } from './app-navigation.service';
import { TestBed } from '@angular/core/testing';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { getLdapTreeLoaderMock } from '@testing/ldap-tree-loader-mock';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { AccessPolicyNodeLoader } from '@core/navigation/node-loaders/policy-loaders/access-policy-node-loader/access-policy-node-loader';
import { getAccessPolicyNodeLoaderMock } from '@testing/access-policy-node-loader-mock';
import { getTranslocoModule } from '@testing/transloco-testing';

xdescribe('NavigationServiceSuite', () => {
  let naviagtionService: AppNavigationService;
  let fixture;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: AccessPolicyNodeLoader, useValue: getAccessPolicyNodeLoaderMock() },
        { provide: LdapEntryLoader, useValue: getLdapTreeLoaderMock() },
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: AppNavigationService, useClass: AppNavigationService },
      ],
      imports: [getTranslocoModule()],
    }).compileComponents();
  });

  beforeEach(() => {
    naviagtionService = TestBed.inject(AppNavigationService);
  });

  it('NavigationService should return root', () => {
    expect(naviagtionService.getRoot()).toBeTruthy();
  });

  it('Navigationservice should return first level consists of different types of nodes', () => {
    naviagtionService
      .getRoot()
      .pipe(take(1))
      .subscribe((tree) => {
        expect(tree[0]).toBeInstanceOf(NavigationNode);
        expect(tree[0].entry?.id).toEqual('server-policy-root');

        expect(tree[1]).toBeInstanceOf(NavigationNode);
        expect(tree[1].entry?.id).toEqual('savedQueries');

        expect(tree[2]).toBeInstanceOf(LdapEntryNode);
        expect(tree[2].entry?.id).toEqual('dc=test,dc=local');
      });
  });
});
