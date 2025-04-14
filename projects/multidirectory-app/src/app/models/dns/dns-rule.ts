import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  record_name = '';
  record_type: DnsRuleType = DnsRuleType.A;
  record_value = '';
  ttl = 3600;

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
