import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { AppFormsModule } from '@features/forms/forms.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@NgModule({
  declarations: [SessionsComponent],
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    TranslocoModule,
    AppFormsModule,
    FontAwesomeModule,
  ],
  exports: [SessionsComponent],
})
export class SessionsModule {}
