import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MultidirectoryAdapterSettings } from './core/api/adapter-settings';
import { ApiAdapter } from './core/api/api-adapter';
import { HideControlBar } from './core/hidecontrolbar.directive';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { CatalogContentComponent } from './components/catalog-content/catalog-content.component';
import { HeaderComponent } from './components/header/header.component';
import { StaleTokenInterceptor } from './core/authorization/stale-token-interceptor';
import { SetupComponent } from './components/setup/setup.component';
import { EntityPropertiesComponent } from './components/entity-properties/entity-properties.component';
import { AdminSettingsComponent } from './components/forms/setup/admin-settings/admin-settings.component';
import { MultidirectoryUiKitModule } from 'projects/multidirectory-ui-kit/src/public-api';
import { PasswordMatchValidatorDirective } from './components/forms/validators/passwordmatch.directive';
import { DomainFormatValidatorDirective } from './components/forms/validators/domainformat.directive';
import { UserCreateGeneralInfoComponent } from './components/forms/user-create/general-info/general-info.component';
import { UserCreatePasswordSettingsComponent } from './components/forms/user-create/password-settings/password-settings.component';
import { UserCreateComponent } from './components/forms/user-create/user-create.component';
import { UserCreateSummaryComponent } from './components/forms/user-create/summary/summary.component';
import { DomainSettingsComponent } from './components/forms/setup/domain-setttings/domain-settings.component';
import { AdminSettingsSecondComponent } from './components/forms/setup/admin-settings-second/admin-settings-second.component';
import { OuCreateComponent } from './components/forms/ou-create/ou-create.component';
import { GroupCreateComponent } from './components/forms/group-create/group-create.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { SearchUsersComponent } from './components/search-panel/seaarch-forms/search-users/search-users.component';
import { SearchResultComponent } from './components/search-panel/seaarch-forms/search-result/search-result.component';
import { TableViewComponent } from './components/catalog-content/views/table-view/table-view.component';
import { NavigationComponent } from './components/navigation/navigation.component';

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
    
    SetupComponent,
    EntityPropertiesComponent,
    AdminSettingsComponent,
    DomainSettingsComponent,
    AdminSettingsSecondComponent,
    PasswordMatchValidatorDirective,
    DomainFormatValidatorDirective,

    UserCreateComponent,
    UserCreateGeneralInfoComponent,
    UserCreatePasswordSettingsComponent,
    UserCreateSummaryComponent,

    OuCreateComponent,

    GroupCreateComponent,
    SearchPanelComponent,
    SearchUsersComponent,
    SearchResultComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MultidirectoryUiKitModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right'})
  ],
  providers: [{
      provide: 'apiAdapter',
      useFactory: (adapterSettings: MultidirectoryAdapterSettings, httpClient: HttpClient) => 
              new ApiAdapter<MultidirectoryAdapterSettings>(httpClient, adapterSettings),
      deps: [MultidirectoryAdapterSettings, HttpClient]
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: StaleTokenInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
