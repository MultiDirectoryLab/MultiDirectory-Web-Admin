import { Inject, Injectable } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { DnsServiceResponse } from '@models/dns/dns-service-response';
import { LoginResponse } from '@models/login/login-response';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DnsApiService {
  constructor(
    @Inject('apiAdapter') private httpClient: ApiAdapter<MultidirectoryAdapterSettings>,
  ) {}
  /* MOCK */
  getDnsRules(): Observable<DnsRule[]> {
    return of([
      new DnsRule({
        ip: '192.0.0.1',
        hostname: 'gimemor.com.',
        record_type: DnsRuleType.SOA,
        ttl: '3600',
      }),
      new DnsRule({
        ip: '192.0.0.1',
        hostname: 'gimemor.com.',
        record_type: DnsRuleType.A,
        ttl: '3600',
      }),
      new DnsRule({
        ip: '192.0.0.2',
        hostname: 'lab.gimemor.com.',
        record_type: DnsRuleType.AAAA,
        ttl: '3600',
      }),
    ]);
  }

  get(): Observable<DnsServiceResponse[]> {
    return this.httpClient.get<DnsServiceResponse[]>('dns/record').execute();
  }

  post(rule: DnsRule): Observable<DnsRule> {
    return this.httpClient
      .post<string>('dns/record', rule)
      .execute()
      .pipe(map((x) => rule));
  }

  update(rule: DnsRule): Observable<DnsRule> {
    return this.httpClient
      .patch<string>('dns/record', rule)
      .execute()
      .pipe(map((x) => rule));
  }

  delete(rule: DnsRule): Observable<string> {
    return this.httpClient.delete<string>('dns/record', rule).execute();
  }
}
