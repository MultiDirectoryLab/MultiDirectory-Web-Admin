import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslocoModule } from '@jsverse/transloco';
import { SharedComponentsModule } from '../../../components/app-layout/shared/shared.module';
import { SessionComponent } from './session/session.component';
import { SessionsComponent } from './sessions.component';

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    FontAwesomeModule,
    SharedComponentsModule,
    SessionsComponent,
    SessionComponent,
  ],
  exports: [SessionsComponent],
})
export class SessionsModule {}
