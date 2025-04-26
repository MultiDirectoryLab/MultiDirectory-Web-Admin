import { Injectable, inject } from '@angular/core';
import { delay, EMPTY, expand, iif, map, Observable, of, switchMap, takeWhile } from 'rxjs';
import { DnsApiService } from './dns-api.service';
import { LoginService } from './login.service';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { KerberosStatuses } from '@models/api/kerberos/kerberos-status';
import { KerberosSetupRequest } from '@models/api/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/api/setup/kerberos-tree-setup-request';
import { SetupRequest } from '@models/api/setup/setup-request';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  private api = inject(MultidirectoryApiService);
  private dns = inject(DnsApiService);
  private loginService = inject(LoginService);

  setup(setupRequest: SetupRequest): Observable<boolean> {
    return this.api.setup(setupRequest).pipe(
      switchMap(() =>
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
        switchMap(() => {
          return this.api.kerberosSetup(
            new KerberosSetupRequest({}).flll_from_setup_request(setupRequest),
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
}
