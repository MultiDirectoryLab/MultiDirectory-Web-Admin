import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHandler, inject, NgModule, provideAppInitializer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { GlobalErrorHandler } from '@core/api/error-handling/global-error-handler';
import { PasswordPolicyViolationInterceptor } from '@core/api/error-handling/password-policy-violation-interceptor';
import { ResultCodeInterceptor } from '@core/api/error-handling/result-code-interceptor';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { AuthRouteGuard } from '@core/authorization/auth-route-guard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { HotkeyModule } from 'angular2-hotkeys';
import { SPINNER_CONFIGUARTION, SpinnerConfiguration } from 'multidirectory-ui-kit';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { appRoutes } from './app.route';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { FooterComponent } from './components/app-layout/footer/footer.component';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TranslocoHttpLoader } from './transloco-loader';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    HotkeyModule.forRoot({ cheatSheetCloseEsc: true }),
    FontAwesomeModule,
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    DisplayErrorComponent,
    AppLayoutComponent,
    SidebarComponent,
    FooterComponent,
    DownloadComponent,
  ],
  providers: [
    AuthRouteGuard,
    provideRouter(appRoutes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideAnimations(),
    provideAppInitializer(() => {
      const translateService: TranslocoService = inject(TranslocoService);
      return lastValueFrom(translateService.load('ru-RU'));
    }),
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
          spinnerText: translateService.translate('spinner.please-wait'),
        });
      },
      deps: [TranslocoService],
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResultCodeInterceptor,
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
  ],
})
export class AppModule {}
