import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  name = '';
  type: DnsRuleType = DnsRuleType.A;
  value = '';
  ttl = 3600;

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
