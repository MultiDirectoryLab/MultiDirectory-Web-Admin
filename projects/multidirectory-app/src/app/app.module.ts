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
import { GroupCreateComponent } from './components/forms/group-create/group-create.component';
import { OuCreateComponent } from './components/forms/ou-create/ou-create.component';
import { AdminSettingsSecondComponent } from './components/forms/setup/admin-settings-second/admin-settings-second.component';
import { AdminSettingsComponent } from './components/forms/setup/admin-settings/admin-settings.component';
import { DomainSettingsComponent } from './components/forms/setup/domain-setttings/domain-settings.component';
import { UserCreateModule } from './components/forms/user-create/user-create.module';
import { ValidatorsModule } from './components/forms/validators/validators.module';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { LoginComponent } from './components/login/login.component';
import { SetupComponent } from './components/setup/setup.component';
import { MultidirectoryAdapterSettings } from './core/api/adapter-settings';
import { ApiAdapter } from './core/api/api-adapter';
import { GlobalErrorHandler } from './core/api/error-handling/global-error-handler';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { HideControlBar } from './core/hidecontrolbar.directive';
import { GroupSelectorModule } from './components/forms/group-selector/group-selector.module';
import { CatalogSelectorModule } from './components/forms/catalog-selector/catalog-selector.module';
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
    LoginComponent,
    HideControlBar,
    HeaderComponent,
    NavigationComponent,
    SetupComponent,
    AdminSettingsComponent,
    DomainSettingsComponent,
    AdminSettingsSecondComponent,
    OuCreateComponent,
    GroupCreateComponent,
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
    ValidatorsModule,
    UserCreateModule,
    PropertiesModule,
    GroupSelectorModule,
    CatalogSelectorModule,
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
