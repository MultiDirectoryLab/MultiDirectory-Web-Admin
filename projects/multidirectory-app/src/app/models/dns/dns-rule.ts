import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  record_name: string = '';
  record_type: DnsRuleType = DnsRuleType.A;
  record_value: string = '';
  ttl: number = 3600;

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
