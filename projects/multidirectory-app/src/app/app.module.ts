import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { LoginComponent } from './components/login/login.component';
import { WizardComponent } from './components/wizard/wizard.component';

@NgModule({
  declarations: [
    AppComponent,
    WizardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MultidirectoryUiKitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
