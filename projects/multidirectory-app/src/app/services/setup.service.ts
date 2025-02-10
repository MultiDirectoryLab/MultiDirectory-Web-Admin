import { Injectable } from '@angular/core';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';
import { SetupRequest } from '@models/setup/setup-request';
import { delay, expand, iif, map, Observable, of, switchMap, takeWhile } from 'rxjs';
import { DnsApiService } from './dns-api.service';
import { LoginService } from './login.service';
import { MultidirectoryApiService } from './multidirectory-api.service';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  constructor(
    private api: MultidirectoryApiService,
    private dns: DnsApiService,
    private loginService: LoginService,
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
      switchMap((success) => {
        return iif(() => setupRequest.setupKdc, this.kerberosSetup(setupRequest), of(!!success));
      }),
    );
  }

  kerberosSetup(setupRequest: SetupRequest) {
    return this.api
      .kerberosTreeSetup(new KerberosTreeSetupRequest({}).flll_from_setup_request(setupRequest))
      .pipe(
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
