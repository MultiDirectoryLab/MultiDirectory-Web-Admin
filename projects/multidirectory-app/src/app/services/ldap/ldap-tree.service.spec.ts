import { TestBed } from '@angular/core/testing';
import { LdapTreeService } from './ldap-tree.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiAdapter } from '@core/api/api-adapter';

describe('LdapTreeService', () => {
  let ldapTreeService: LdapTreeService;
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000; // Set timeout interval to 100 seconds

    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
        }),
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        LdapTreeService,
        {
          provide: 'apiAdapter',
          useFactory: (
            adapterSettings: MultidirectoryAdapterSettings,
            httpClient: HttpClient,
            toastr: ToastrService,
          ) => new ApiAdapter<MultidirectoryAdapterSettings>(httpClient, adapterSettings, toastr),
          deps: [MultidirectoryAdapterSettings, HttpClient, ToastrService],
        },
      ],
    });

    ldapTreeService = TestBed.inject(LdapTreeService);
  });

  it('should be created', () => {
    expect(ldapTreeService).toBeTruthy();
  });

  it('should expand rootDSE', async () => {
    const result = await ldapTreeService.load('');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toEqual('');
  });

  it('should expand children', async () => {
    const result = await ldapTreeService.load('dc=localhost,dc=dev');
    expect(result.length).toBeGreaterThan(1);
    expect(result[1]).toEqual('ou=users,dc=localhost,dc=dev');
    expect(result[0]).toEqual('cn=groups,dc=localhost,dc=dev');
  });
});
