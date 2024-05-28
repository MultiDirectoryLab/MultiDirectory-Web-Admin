import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ModalControlModule } from '@core/modal-control/modal-control.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    FormsModule,
    TranslocoModule,
    ModalControlModule,
    LoginRoutingModule,
  ],
})
export class LoginModule {}
