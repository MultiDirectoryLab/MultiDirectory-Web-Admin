import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler, inject, NgModule, provideAppInitializer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { ApiAdapter } from '@core/api/api-adapter';
import { GlobalErrorHandler } from '@core/api/error-handling/global-error-handler';
import { AuthorizationModule } from '@core/authorization/authorization.module';
import { TranslocoRootModule } from './transloco-root.module';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import {
  MultidirectoryUiKitModule,
  SPINNER_CONFIGUARTION,
  SpinnerConfiguration,
} from 'multidirectory-ui-kit';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { AppSettingsModule } from '@features/settings/app-settings.module';
import { SearchPanelModule } from '@features/search/search-panel.module';
import { PropertiesModule } from '@features/ldap-properties/properties.module';
import { AppFormsModule } from '@features/forms/forms.module';
import { SharedComponentsModule } from './components/app-layout/shared/shared.module';
import { FooterComponent } from './components/app-layout/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DownloadComponent } from './components/app-layout/shared/download-dict.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { TranslocoService } from '@jsverse/transloco';
import { lastValueFrom } from 'rxjs';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    DisplayErrorComponent,
    AppLayoutComponent,
    SidebarComponent,
    FooterComponent,
    DownloadComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    EditorsModule,
    PropertiesModule,
    SearchPanelModule,
    AppFormsModule,
    SharedComponentsModule,
    FontAwesomeModule,
  ],
  providers: [
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
