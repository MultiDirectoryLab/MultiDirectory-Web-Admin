import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouteReuseStrategy, withRouterConfig } from '@angular/router';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { GlobalErrorHandler } from '@core/api/error-handling/global-error-handler';
import { PasswordPolicyViolationInterceptor } from '@core/api/error-handling/password-policy-violation-interceptor';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { CustomOverlayContainer } from '@models/custom-overlay-container';
import { HotkeyModule } from 'angular2-hotkeys';
import { SPINNER_CONFIGUARTION, SpinnerConfiguration } from 'multidirectory-ui-kit';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { DIALOG_CONFIG_DEFAULT } from './components/modals/constants/dialog.constants';
import { TranslocoHttpLoader } from './transloco-loader';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideAppInitializer(() => lastValueFrom(inject(TranslocoService).load('ru-RU'))),
    provideAnimations(),
    importProvidersFrom(
      BrowserModule,
      DragDropModule,
      FormsModule,
      ReactiveFormsModule,
      ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
      HotkeyModule.forRoot({ cheatSheetCloseEsc: true }),
      FontAwesomeModule,
    ),
    {
      provide: 'apiAdapter',
      useFactory: () =>
        new ApiAdapter<MultidirectoryAdapterSettings>(inject(HttpClient), inject(MultidirectoryAdapterSettings), inject(ToastrService)),
    },
    {
      provide: 'dnsAdapter',
      useFactory: () => new ApiAdapter<DnsAdapterSettings>(inject(HttpClient), inject(DnsAdapterSettings), inject(ToastrService)),
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PasswordPolicyViolationInterceptor,
      multi: true,
    },
    provideTransloco({
      config: {
        availableLangs: ['en-US', 'ru-RU'],
        defaultLang: localStorage.getItem('locale') ?? 'ru-RU',
        prodMode: environment.production,
        reRenderOnLangChange: true,
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: SPINNER_CONFIGUARTION,
      useFactory: () => {
        return new SpinnerConfiguration({
          spinnerText: inject(TranslocoService).translate('spinner.please-wait'),
        });
      },
    },
    {
      provide: OverlayContainer,
      useClass: CustomOverlayContainer,
    },
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: DIALOG_CONFIG_DEFAULT,
    },
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
