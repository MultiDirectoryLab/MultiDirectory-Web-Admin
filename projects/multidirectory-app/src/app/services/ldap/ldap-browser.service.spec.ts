import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LdapTreeService } from './ldap-tree.service';
import { LdapBrowserService } from './ldap-browser.service';

describe('LDAP Browser Service', () => {
  let ldapContentService: LdapBrowserService;
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

    ldapContentService = TestBed.inject(LdapBrowserService);
  });

  it('Should get LDAP content', async () => {
    const [content, pageCount, entiresCount] = await ldapContentService.loadContent(
      'ou=users,dc=localhost,dc=dev',
      '',
      2,
      2,
    );
    expect(content.length).toEqual(2);
    expect(pageCount).toEqual(6);
    expect(entiresCount).toEqual(11);
  });

  it('Should get page count', async () => {});
});
