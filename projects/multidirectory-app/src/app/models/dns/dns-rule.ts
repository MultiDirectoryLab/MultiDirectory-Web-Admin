import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  hostname: string = '';
  record_type: DnsRuleType = DnsRuleType.A;
  ip: string = '';
  ttl: string = '3600';

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
