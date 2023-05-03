import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MultidirectoryAdapterSettings } from './core/api/adapter-settings';
import { ApiAdapter } from './core/api/api-adapter';
import { HideControlBar } from './components/login/hidecontrolbar.directive';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HideControlBar,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MultidirectoryUiKitModule,
    ToastrModule.forRoot()
  ],
  providers: [{
      provide: 'apiAdapter',
      useFactory: (adapterSettings: MultidirectoryAdapterSettings, httpClient: HttpClient) => 
              new ApiAdapter<MultidirectoryAdapterSettings>(httpClient, adapterSettings),
      deps: [MultidirectoryAdapterSettings, HttpClient]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
