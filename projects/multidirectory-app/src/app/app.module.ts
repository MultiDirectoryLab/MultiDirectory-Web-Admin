import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HotkeyModule } from 'angular2-hotkeys';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { MultidirectoryAdapterSettings } from './core/api/adapter-settings';
import { ApiAdapter } from './core/api/api-adapter';
import { GlobalErrorHandler } from './core/api/error-handling/global-error-handler';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { TranslocoRootModule } from './transloco-root.module';
import { BackendNotRespondedComponent } from './components/errors/backend-does-not-responded/backend-not-responded.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AppSettingsModule } from './components/settings/app-settings.module';
import { EditorsModule } from './features/ldap-browser/editors/editors.module';
import { SearchResultComponent } from './features/ldap-browser/search-panel/seaarch-forms/search-result/search-result.component';
import { SearchUsersComponent } from './features/ldap-browser/search-panel/seaarch-forms/search-users/search-users.component';
import { SearchPanelComponent } from './features/ldap-browser/search-panel/search-panel.component';
import { PropertiesModule } from './features/ldap-browser/entity-properties/properties.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationComponent,
    SearchPanelComponent,
    SearchUsersComponent,
    SearchResultComponent,
    BackendNotRespondedComponent,
    AppLayoutComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    DragDropModule,
    AppRoutingModule,
    AppSettingsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MultidirectoryUiKitModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right'}),
    HotkeyModule.forRoot({
      cheatSheetCloseEsc: true,
    }),
    AuthorizationModule,
    PropertiesModule,
    TranslocoRootModule,
    EditorsModule
  ],
  providers: [
    provideAnimations(),
    {
      provide: 'apiAdapter',
      useFactory: (adapterSettings: MultidirectoryAdapterSettings, httpClient: HttpClient, toastr: ToastrService) => 
              new ApiAdapter<MultidirectoryAdapterSettings>(httpClient, adapterSettings, toastr),
      deps: [MultidirectoryAdapterSettings, HttpClient, ToastrService]
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
