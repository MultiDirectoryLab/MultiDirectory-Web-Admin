import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { AppFormsModule } from '@features/forms/forms.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SharedComponentsModule } from '../../../components/app-layout/shared/shared.module';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [SessionsComponent, SessionComponent],
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    TranslocoModule,
    AppFormsModule,
    FontAwesomeModule,
    SharedComponentsModule,
  ],
  exports: [SessionsComponent],
})
export class SessionsModule {}
