import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { LdapTreeService } from '@services/ldap/ldap-tree.service';
import { of } from 'rxjs';
import { NavigationComponent } from './navigation.component';
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('NewNavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let activatedRouteMock: ActivatedRoute;

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: of({ distinguishedName: 'test-dn' }),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
        }),
        RouterModule.forRoot([]),
      ],
      declarations: [NavigationComponent],
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
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentLdapPosition and build tree on ngAfterViewInit', () => {
    component.ngAfterViewInit();
  });

  it('should alert node id on onExpandClick', () => {});

  it('should complete unsubscribe on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['unsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
