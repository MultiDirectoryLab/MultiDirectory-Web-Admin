import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, defaultIfEmpty, iif, of, tap } from 'rxjs';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { TranslocoService } from '@ngneat/transloco';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  constructor(
    private api: MultidirectoryApiService,
    private translocoService: TranslocoService,
  ) {}
  navigationalPanelVisibleRx = new BehaviorSubject<boolean>(true);
  setNavigationalPanelVisiblity(state: boolean) {
    this.navigationalPanelVisibleRx.next(state);
  }

  private _darkMode: boolean = localStorage.getItem('dark-mode') == 'true';
  private _darkModeRx = new BehaviorSubject<boolean>(this._darkMode);
  get darkModeRx() {
    return this._darkModeRx.asObservable();
  }
  setDarkMode(state: boolean) {
    localStorage.setItem('dark-mode', state ? 'true' : 'false');
    this._darkModeRx.next(state);
  }

  userEntry?: LdapEntryNode;
  private _user: WhoamiResponse = new WhoamiResponse({});
  get user(): WhoamiResponse {
    return this._user;
  }
  set user(user: WhoamiResponse) {
    this._user = user;
  }
  get userRx(): Observable<WhoamiResponse> {
    return iif(
      () => this._user.id == 0,
      this.api.whoami().pipe(
        tap((x) => {
          this.user = x;
        }),
      ),
      of(this._user),
    );
  }

  private _language: string = localStorage.getItem('locale') ?? 'en-US';
  get language(): string {
    return this._language;
  }
  set language(lang: string) {
    this._language = lang;
    localStorage.setItem('locale', lang);
    this.translocoService.setActiveLang(lang);
  }
  private _languageRx = new Subject<string>();
  get languageRx(): Observable<string> {
    return this._languageRx.asObservable();
  }

  private _kerberosStatus: KerberosStatuses = KerberosStatuses.READY;
  get kerberosStatus(): KerberosStatuses {
    return this._kerberosStatus;
  }
  set kerberosStatus(krbStatus: KerberosStatuses) {
    this._kerberosStatus = krbStatus;
    this._kerberosStatusRx.next(krbStatus);
  }
  private _kerberosStatusRx = new BehaviorSubject<KerberosStatuses>(this._kerberosStatus);
  get kerberosStatusRx(): Observable<KerberosStatuses> {
    return this._kerberosStatusRx.asObservable();
  }

  private _notificationVisible = false;
  get notificationVisible(): boolean {
    return this._notificationVisible;
  }
  set notificationVisible(isVisible: boolean) {
    this._notificationVisible = isVisible;
    this._notificationVisibleRx.next(isVisible);
  }
  private _notificationVisibleRx = new BehaviorSubject<boolean>(this._notificationVisible);
  get notificationVisibleRx(): Observable<boolean> {
    return this._notificationVisibleRx.asObservable();
  }
}
