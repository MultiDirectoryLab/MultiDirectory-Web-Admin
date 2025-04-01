import { APP_INITIALIZER, enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { appInitializerFactory } from './app/app.module';
import { environment } from './environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { translate, TranslocoService } from '@jsverse/transloco';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { GlobalErrorHandler } from '@core/api/error-handling/global-error-handler';
import {
  MultidirectoryUiKitModule,
  SPINNER_CONFIGUARTION,
  SpinnerConfiguration,
} from 'multidirectory-ui-kit';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from '@models/custom-overlay-container';
import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { DIALOG_CONFIG_DEFAULT } from './app/components/modals/constants/dialog.constants';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app/app-routing.module';
import { AppSettingsModule } from '@features/settings/app-settings.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotkeyModule } from 'angular2-hotkeys';
import { AuthorizationModule } from '@core/authorization/authorization.module';
import { TranslocoRootModule } from './app/transloco-root.module';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { SearchPanelModule } from '@features/search/search-panel.module';
import { AppFormsModule } from '@features/forms/forms.module';
import { SharedComponentsModule } from './app/components/app-layout/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      DragDropModule,
      AppRoutingModule,
      AppSettingsModule,
      FormsModule,
      ReactiveFormsModule,
      MultidirectoryUiKitModule,
      ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
      HotkeyModule.forRoot({
        cheatSheetCloseEsc: true,
      }),
      AuthorizationModule,
      TranslocoRootModule,
      PropertiesModule,
      SearchPanelModule,
      AppFormsModule,
      SharedComponentsModule,
      FontAwesomeModule,
    ),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslocoService],
      multi: true,
    },
    {
      provide: 'apiAdapter',
      useFactory: (
        adapterSettings: MultidirectoryAdapterSettings,
        httpClient: HttpClient,
        toastr: ToastrService,
      ) => new ApiAdapter<MultidirectoryAdapterSettings>(httpClient, adapterSettings, toastr),
      deps: [MultidirectoryAdapterSettings, HttpClient, ToastrService],
    },
    {
      provide: 'dnsAdapter',
      useFactory: (
        adapterSettings: DnsAdapterSettings,
        httpClient: HttpClient,
        toastr: ToastrService,
      ) => new ApiAdapter<DnsAdapterSettings>(httpClient, adapterSettings, toastr),
      deps: [DnsAdapterSettings, HttpClient, ToastrService],
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: SPINNER_CONFIGUARTION,
      useFactory: (translateService: TranslocoService) => {
        return new SpinnerConfiguration({
          spinnerText: translate('spinner.please-wait'),
        });
      },
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: OverlayContainer,
      useClass: CustomOverlayContainer,
    },
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: DIALOG_CONFIG_DEFAULT,
    },
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
