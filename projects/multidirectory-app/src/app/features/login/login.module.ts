import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '@features/login/login.component';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  imports: [CommonModule, FormsModule, TranslocoModule, LoginComponent],
})
export class LoginModule {}
