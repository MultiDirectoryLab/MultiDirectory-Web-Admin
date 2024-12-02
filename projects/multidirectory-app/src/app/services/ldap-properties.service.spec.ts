import { TestBed } from '@angular/core/testing';
import { SearchRequest } from '@models/entry/search-request';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { ShortMockedSchema } from '@testing/scheme/short-mocked-schema';
import { getTranslocoModule } from '@testing/transloco-testing';
import { of, take, zip } from 'rxjs';
import { LdapPropertiesService } from './ldap-properties.service';
import { MultidirectoryApiService } from './multidirectory-api.service';

describe('Ldap Properties Services', () => {
  let propertiesService: LdapPropertiesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: MultidirectoryApiService, useValue: getMultidirectoryApiMock() },
        { provide: LdapPropertiesService, useClass: LdapPropertiesService },
      ],
      imports: [getTranslocoModule()],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    propertiesService = TestBed.inject(LdapPropertiesService);
  });

  function useShortSchema() {
    const api = TestBed.inject(MultidirectoryApiService) as any;
    api.search.and.callFake((request: SearchRequest) => {
      if (request.base_object.includes('CN=Schema')) {
        return of(ShortMockedSchema);
      }
      return of(['123']);
    });
  }

  it('Should parse schema', () => {
    useShortSchema();
    propertiesService
      .loadSchema()
      .pipe(take(1))
      .subscribe((schema) => {
        expect(schema.length).toEqual(2);
        expect(schema[0].name).toEqual('name');
        expect(schema[1].name).toEqual('objectClass');
      });
  });

  it('Should load entity properties', () => {
    zip(
      propertiesService.loadEntityProperties('dc=md,dc=localhost,dc=dev'),
      propertiesService.loadEntityProperties('cn=groups,dc=md,dc=localhost,dc=dev'),
    )
      .pipe(take(1))
      .subscribe(([first, second]) => {
        const secondObjectClass = second.find((x) => x.name == 'objectClass');
        expect(first.length).toEqual(6);
        expect(secondObjectClass?.val.includes('container')).toBeTrue();
      });
  });
});
