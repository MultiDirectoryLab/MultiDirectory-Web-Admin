import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DomainSettingsComponent } from './components/forms/domain-setttings/domain-settings.component';
import { AdminSettingsComponent } from './components/forms/admin-settings/admin-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HideControlBar,
    HomeComponent,
    HeaderComponent,
    CatalogContentComponent,
    SetupComponent,
    EntityPropertiesComponent,
    DomainSettingsComponent,
    AdminSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MultidirectoryUiKitModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
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
