import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    FormsModule,
    TranslocoModule,
    LoginRoutingModule,
  ],
})
export class LoginModule {}
