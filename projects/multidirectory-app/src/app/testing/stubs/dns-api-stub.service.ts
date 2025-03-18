import { Injectable } from '@angular/core';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsServiceResponse } from '@models/api/dns/dns-service-response';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsApiService } from '@services/dns-api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DnsApiStubService extends DnsApiService {
  override get(): Observable<DnsServiceResponse[]> {
    return of([]);
  }

  override post(rule: DnsRule): Observable<DnsRule> {
    return of(
      new DnsRule({
        record_name: '',
        record_value: '',
        ttl: 0,
      }),
    );
  }

  override update(rule: DnsRule): Observable<DnsRule> {
    return of(
      new DnsRule({
        record_name: '',
        record_value: '',
        ttl: 0,
      }),
    );
  }

  override delete(rule: DnsRule): Observable<string> {
    return of('');
  }

  override status(): Observable<DnsStatusResponse> {
    return of(new DnsStatusResponse({}));
  }

  override setup(request: DnsSetupRequest): Observable<boolean> {
    return of(false);
  }
}
