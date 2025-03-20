import { TestBed } from '@angular/core/testing';
import { LdapTreeService } from './ldap-tree.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiAdapter } from '@core/api/api-adapter';
import { LdapTreeviewService } from './ldap-treeview.service';

describe('LdapTreeviewService', () => {
  let treeviewService: LdapTreeviewService;
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
        LdapTreeviewService,
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

    treeviewService = TestBed.inject(LdapTreeviewService);
  });

  it('should be created', () => {
    expect(treeviewService).toBeTruthy();
  });

  it('should expand rootDSE', async () => {
    const result = await treeviewService.expand('ou=users,dc=localhost,dc=dev');
    expect(result.length).toBeGreaterThan(0);
  });
});
