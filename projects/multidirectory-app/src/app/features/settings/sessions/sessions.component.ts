import { Component, inject, OnInit } from '@angular/core';
import { SessionComponent } from '@features/settings/sessions/session/session.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppSettingsService } from '@services/app-settings.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, switchMap, take } from 'rxjs';
import { ConfirmDialogComponent } from '../../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../../components/modals/interfaces/confirm-dialog.interface';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { UserSession } from '@models/api/sessions/user-session';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  standalone: true,
  imports: [TranslocoPipe, ButtonComponent, SessionComponent],
})
export class SessionsComponent implements OnInit {
  sessions: UserSession[] = [];

  private dialogService: DialogService = inject(DialogService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private app: AppSettingsService = inject(AppSettingsService);
  private navigation: AppNavigationService = inject(AppNavigationService);
  private toastr: ToastrService = inject(ToastrService);

  ngOnInit(): void {
    this.api.getSessions(this.app.user.user_principal_name).subscribe((x) => {
      this.sessions = x;
    });
  }

  onSessionDelete(session: UserSession) {
    this.dialogService
      .open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
        component: ConfirmDialogComponent,
        dialogConfig: {
          data: {
            promptHeader: translate('sessions.close-session-confirmation-header'),
            promptText: translate('sessions.close-session-confirmation-description'),
            primaryButtons: [{ id: 'yes', text: translate('sessions.close-confirmation-yes') }],
            secondaryButtons: [{ id: 'cancel', text: translate('sessions.close-confirmation-no') }],
          },
        },
      })
      .closed.pipe(
        switchMap((result) => {
          if (result == 'yes') {
            return this.api.deleteSession(session.session_id);
          }
          return EMPTY;
        }),
        take(1),
      )
      .subscribe(() => {
        this.toastr.success(translate('sessions.success'));
      });
  }

  onDeleteAll() {
    this.dialogService
      .open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
        component: ConfirmDialogComponent,
        dialogConfig: {
          data: {
            promptHeader: translate('sessions.close-all-confirmation-header'),
            promptText: translate('sessions.close-all-confirmation-description'),
            primaryButtons: [{ id: 'yes', text: translate('sessions.close-confirmation-yes') }],
            secondaryButtons: [{ id: 'cancel', text: translate('sessions.close-confirmation-no') }],
          },
        },
      })
      .closed.pipe(
        switchMap((result) => {
          if (result == 'yes') {
            return this.api.deleteUserSessions(this.app.user.user_principal_name);
          }
          return EMPTY;
        }),
        take(1),
      )
      .subscribe(() => {
        this.toastr.success(translate('sessions.success'));
      });
  }
}
