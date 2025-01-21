import { Injectable } from '@angular/core';
import { SetupRequest } from '@models/setup/setup-request';
import {
  catchError,
  delay,
  EMPTY,
  expand,
  iif,
  map,
  Observable,
  of,
  retry,
  switchMap,
  take,
  takeWhile,
} from 'rxjs';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { LoginService } from './login.service';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { ToastrService } from 'ngx-toastr';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { DnsApiService } from './dns-api.service';
import { ReturnStatement } from '@angular/compiler';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  constructor(
    private api: MultidirectoryApiService,
    private dns: DnsApiService,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) {}

  setup(setupRequest: SetupRequest): Observable<boolean> {
    return this.api.setup(setupRequest).pipe(
      switchMap((success) =>
        this.loginService.login(setupRequest.user_principal_name, setupRequest.password),
      ),
      switchMap((success) => {
        return iif(
          () => setupRequest.setupDns,
          this.dns.setup(setupRequest.setupDnsRequest),
          of(!!success),
        );
      }),
      catchError((err) => {
        return of(false);
      }),
      switchMap((success) => {
        return iif(
          () => setupRequest.setupKdc,
          this.api.kerberosTreeSetup(
            new KerberosTreeSetupRequest({}).flll_from_setup_request(setupRequest),
          ),
          of(!!success),
        );
      }),
      catchError((err) => {
        if (err.status == 409) {
          return of(true);
        }
        return of(false);
      }),
      switchMap((success) => {
        return iif(
          () => setupRequest.setupKdc,
          this.api.kerberosSetup(
            new KerberosSetupRequest({}).flll_from_setup_request(setupRequest),
          ),
          of(success),
        );
      }),
      switchMap((success) => {
        // Polling getKerberosStatus every 1 second until status === 1
        let callCount = 0;
        return iif(
          () => setupRequest.setupKdc,
          this.api.getKerberosStatus().pipe(
            expand(() => {
              callCount++;
              if (callCount > 15) {
                return EMPTY;
              }
              return this.api.getKerberosStatus().pipe(delay(1000));
            }),
            takeWhile((status) => status !== KerberosStatuses.READY, true),
            map((x) => x == KerberosStatuses.READY), // Continue until status === 1
          ),
          of(success),
        );
      }),
    );
  }

  kerberosSetup(setupRequest: SetupRequest) {
    return this.api
      .kerberosTreeSetup(new KerberosTreeSetupRequest({}).flll_from_setup_request(setupRequest))
      .pipe(
        catchError((err) => {
          if (err.status == 409) {
            return of(true);
          }
          return of(false);
        }),
        switchMap((value) => {
          return this.api.kerberosSetup(
            new KerberosSetupRequest({}).flll_from_setup_request(setupRequest),
          );
        }),
        switchMap((success) => {
          // Polling getKerberosStatus every 1 second until status === 1
          return iif(
            () => setupRequest.setupKdc,
            this.api.getKerberosStatus().pipe(
              expand(
                () => this.api.getKerberosStatus().pipe(delay(1000)), // Repeat the call every 1 second
              ),
              takeWhile((status) => status !== KerberosStatuses.READY, true),
              map((x) => x == KerberosStatuses.READY), // Continue until status === 1
            ),
            of(success),
          );
        }),
      );
  }
}
