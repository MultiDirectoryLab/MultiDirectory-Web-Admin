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
import { HomeComponent } from './components/home/home.component';
import { CatalogContentComponent } from './components/catalog-content/catalog-content.component';
import { HeaderComponent } from './components/header/header.component';
import { StaleTokenInterceptor } from './core/authorization/stale-token-interceptor';
import { SetupComponent } from './components/setup/setup.component';
import { EntityPropertiesComponent } from './components/entity-properties/entity-properties.component';
import { AdminSettingsComponent } from './components/forms/setup/admin-settings/admin-settings.component';
import { MultidirectoryUiKitModule } from 'projects/multidirectory-ui-kit/src/public-api';
import { DomainSettingsComponent } from './components/forms/setup/domain-setttings/domain-settings.component';
import { AdminSettingsSecondComponent } from './components/forms/setup/admin-settings-second/admin-settings-second.component';
import { OuCreateComponent } from './components/forms/ou-create/ou-create.component';
import { GroupCreateComponent } from './components/forms/group-create/group-create.component';
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import { SearchUsersComponent } from './components/search-panel/seaarch-forms/search-users/search-users.component';
import { SearchResultComponent } from './components/search-panel/seaarch-forms/search-result/search-result.component';
import { TableViewComponent } from './components/catalog-content/views/table-view/table-view.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ResultCodeInterceptor } from './core/api/error-handling/result-code-interceptor';
import { GlobalErrorHandler } from './core/api/error-handling/global-error-handler';
import { IconViewComponent } from './components/catalog-content/views/icon-view/icon-view.component';
import { GridItemComponent } from './components/catalog-content/views/icon-view/grid-item/grid-item.component';
import { RefreshTokenInterceptor } from './core/authorization/refresh-token-interceptor';
import { EnsureBearerInterceptor } from './core/authorization/ensure-bearer-interceptor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HotkeyModule } from 'angular2-hotkeys';
import { EntityAttributesComponent } from './components/entity-properties/entity-attributes/entity-attributes.component';
import { UserCreateModule } from './components/forms/user-create/user-create.module';
import { ValidatorsModule } from './components/forms/validators/validators.module';

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
    EntityPropertiesComponent,
    EntityAttributesComponent,
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
    ValidatorsModule,
    UserCreateModule
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
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: EnsureBearerInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: StaleTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ResultCodeInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
