import { Component, OnInit, inject } from '@angular/core';
import { SessionComponent } from '@features/settings/sessions/session/session.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { UserSession } from '@models/sessions/user-session';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  imports: [TranslocoPipe, ButtonComponent, SessionComponent],
})
export class SessionsComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  private app = inject(AppSettingsService);
  private navigation = inject(AppNavigationService);
  private toastr = inject(ToastrService);
  private windows = inject(AppWindowsService);

  sessions: UserSession[] = [];

  ngOnInit(): void {
    this.api.getSessions(this.app.user.user_principal_name).subscribe((x) => {
      this.sessions = x;
    });
  }

  onSessionDelete(session: UserSession) {
    this.windows
      .openConfirmDialog({
        promptHeader: translate('sessions.close-session-confirmation-header'),
        promptText: translate('sessions.close-session-confirmation-description'),
        primaryButtons: [{ id: 'yes', text: translate('sessions.close-confirmation-yes') }],
        secondaryButtons: [{ id: 'cancel', text: translate('sessions.close-confirmation-no') }],
      })
      .pipe(
        switchMap((result) => {
          if (result == 'yes') {
            return this.api.deleteSession(session.session_id);
          }
          return EMPTY;
        }),
        take(1),
      )
      .subscribe((result) => {
        this.toastr.success(translate('sessions.success'));
        this.navigation.reload();
      });
  }

  onDeleteAll() {
    this.windows
      .openConfirmDialog({
        promptHeader: translate('sessions.close-all-confirmation-header'),
        promptText: translate('sessions.close-all-confirmation-description'),
        primaryButtons: [{ id: 'yes', text: translate('sessions.close-confirmation-yes') }],
        secondaryButtons: [{ id: 'cancel', text: translate('sessions.close-confirmation-no') }],
      })
      .pipe(
        switchMap((result) => {
          if (result == 'yes') {
            return this.api.deleteUserSessions(this.app.user.user_principal_name);
          }
          return EMPTY;
        }),
        take(1),
      )
      .subscribe((result) => {
        this.toastr.success(translate('sessions.success'));
        this.navigation.reload();
      });
  }
}
