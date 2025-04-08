import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler, inject, NgModule, provideAppInitializer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { GlobalErrorHandler } from '@core/api/error-handling/global-error-handler';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { AuthRouteGuard } from '@core/authorization/auth-route-guard';
import { AuthorizationModule } from '@core/authorization/authorization.module';
import { AppFormsModule } from '@features/forms/forms.module';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { SearchPanelModule } from '@features/search/search-panel.module';
import { AppSettingsModule } from '@features/settings/app-settings.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoService } from '@jsverse/transloco';
import { HotkeyModule } from 'angular2-hotkeys';
import { SPINNER_CONFIGUARTION, SpinnerConfiguration } from 'multidirectory-ui-kit';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from './app.component';
import { appRoutes } from './app.route';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { FooterComponent } from './components/app-layout/footer/footer.component';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';
import { SharedComponentsModule } from './components/app-layout/shared/shared.module';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    AppSettingsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    HotkeyModule.forRoot({
      cheatSheetCloseEsc: true,
    }),
    AuthorizationModule,
    TranslocoRootModule,
    EditorsModule,
    PropertiesModule,
    SearchPanelModule,
    AppFormsModule,
    SharedComponentsModule,
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
  ],
})
export class AppModule {}
