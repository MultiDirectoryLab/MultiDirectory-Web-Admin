import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { translate } from '@jsverse/transloco';
import { UserSession } from '@models/sessions/user-session';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppSettingsService } from '@services/app-settings.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  sessions: UserSession[] = [];

  constructor(
    private api: MultidirectoryApiService,
    private app: AppSettingsService,
    private navigation: AppNavigationService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.api.getSessions(this.app.user.user_principal_name).subscribe((x) => {
      this.sessions = x;
    });
  }

  onSessionDelete(session: UserSession) {
    this.api.deleteSession(session.session_id).subscribe((x) => {
      this.toastr.success(translate('sessions.success'));
      this.navigation.reload();
    });
  }

  onDeleteAll() {
    this.api.deleteUserSessions(this.app.user.user_principal_name).subscribe((x) => {
      this.toastr.success(translate('sessions.success'));
      this.navigation.reload();
    });
  }
}
