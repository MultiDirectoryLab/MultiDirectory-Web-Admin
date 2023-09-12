import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MultidirectoryAdapterSettings } from './core/api/adapter-settings';
import { ApiAdapter } from './core/api/api-adapter';
import { HideControlBar } from './core/hidecontrolbar.directive';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { SetupComponent } from './components/setup/setup.component';
import { AdminSettingsComponent } from './components/forms/setup/admin-settings/admin-settings.component';
import { DomainSettingsComponent } from './components/forms/setup/domain-setttings/domain-settings.component';
import { AdminSettingsSecondComponent } from './components/forms/setup/admin-settings-second/admin-settings-second.component';
import { OuCreateComponent } from './components/forms/ou-create/ou-create.component';
import { GroupCreateComponent } from './components/forms/group-create/group-create.component';
import { GlobalErrorHandler } from './core/api/error-handling/global-error-handler';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HotkeyModule } from 'angular2-hotkeys';
import { UserCreateModule } from './components/forms/user-create/user-create.module';
import { ValidatorsModule } from './components/forms/validators/validators.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { AccessControlModule } from './components/access-control-menu/access-control-menu.module';
import { CatalogContentComponent } from './components/ldap-browser/catalog-content/catalog-content.component';
import { GridItemComponent } from './components/ldap-browser/catalog-content/views/icon-view/grid-item/grid-item.component';
import { IconViewComponent } from './components/ldap-browser/catalog-content/views/icon-view/icon-view.component';
import { TableViewComponent } from './components/ldap-browser/catalog-content/views/table-view/table-view.component';
import { PropertiesModule } from './components/ldap-browser/entity-properties/properties.module';
import { HeaderComponent } from './components/ldap-browser/header/header.component';
import { HomeComponent } from './components/ldap-browser/home/home.component';
import { NavigationComponent } from './components/ldap-browser/navigation/navigation.component';
import { SearchResultComponent } from './components/ldap-browser/search-panel/seaarch-forms/search-result/search-result.component';
import { SearchUsersComponent } from './components/ldap-browser/search-panel/seaarch-forms/search-users/search-users.component';
import { SearchPanelComponent } from './components/ldap-browser/search-panel/search-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HideControlBar,
    HomeComponent,
    HeaderComponent,
    NavigationComponent,
    CatalogContentComponent,
    TableViewComponent,
    IconViewComponent,
    GridItemComponent,
    SetupComponent,
    AdminSettingsComponent,
    DomainSettingsComponent,
    AdminSettingsSecondComponent,
    OuCreateComponent,

    GroupCreateComponent,
    SearchPanelComponent,
    SearchUsersComponent,
    SearchResultComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    DragDropModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MultidirectoryUiKitModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right'}),
    HotkeyModule.forRoot({
      cheatSheetCloseEsc: true,
      cheatSheetCloseEscDescription: 'Скрыть меню помощи',
      cheatSheetDescription: 'Показать/скрыть меню помощи'
    }),
    AuthorizationModule,
    ValidatorsModule,
    UserCreateModule,
    PropertiesModule,
    AccessControlModule
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
