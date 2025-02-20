import { Injectable } from '@angular/core';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';
import { SetupRequest } from '@models/setup/setup-request';
import { delay, EMPTY, expand, iif, map, Observable, of, switchMap, takeWhile } from 'rxjs';
import { DnsApiService } from './dns-api.service';
import { LoginService } from './login.service';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { LoginResponse } from '@models/login/login-response';

@Injectable({
  providedIn: 'root',
})
export class SetupService {
  constructor(
    private api: MultidirectoryApiService,
    private dns: DnsApiService,
    private loginService: LoginService,
  ) {}

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

  initialSetup(setupRequest: SetupRequest): Observable<LoginResponse> {
    return this.api.setup(setupRequest).pipe(
      switchMap((success) => {
        return this.loginService.login(setupRequest.user_principal_name, setupRequest.password);
      }),
    );
  }

  dnsSetup(setupRequest: SetupRequest): Observable<boolean> {
    return this.dns.setup(setupRequest.setupDnsRequest);
  }
}
