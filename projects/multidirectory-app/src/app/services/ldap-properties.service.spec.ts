import { TestBed } from '@angular/core/testing';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { getMultidirectoryApiMock } from '@testing/multidirectory-api-mock.service';
import { getTranslocoModule } from '@testing/transloco-testing';
import { LdapPropertiesService } from './ldap-properties.service';
import { first, switchMap, take, zip } from 'rxjs';

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

  it('Should get schema', async () => {
    propertiesService
      .loadSchema()
      .pipe(take(1))
      .subscribe((x) => {
        expect(x).toBeTruthy();
        expect(x.length).toBeGreaterThan(500);
      });
  });

  it('Should load entity properties', () => {
    zip(
      propertiesService.loadEntityProperties('dc=md,dc=localhost,dc=dev'),
      propertiesService.loadEntityProperties('cn=groups,dc=md,dc=localhost,dc=dev'),
    )
      .pipe(take(1))
      .subscribe(([first, second]) => {
        console.log(first.length);

        const secondObjectClass = second.find((x) => x.name == 'objectClass');
        console.log(secondObjectClass?.val);
      });
  });
});
