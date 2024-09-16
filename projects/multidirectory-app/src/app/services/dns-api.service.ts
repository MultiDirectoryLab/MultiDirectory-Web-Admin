import { Injectable } from '@angular/core';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DnsApiService {
  getDnsRules(): Observable<DnsRule[]> {
    return of([
      new DnsRule({
        ip: '192.0.0.1',
        name: 'gimemor.com.',
        type: DnsRuleType.SOA,
        ttl: 3600,
      }),
      new DnsRule({
        ip: '192.0.0.1',
        name: 'gimemor.com.',
        type: DnsRuleType.A,
        ttl: 3600,
      }),
      new DnsRule({
        ip: '192.0.0.2',
        name: 'lab.gimemor.com.',
        type: DnsRuleType.AAAA,
        ttl: 3600,
      }),
    ]);
  }
}
