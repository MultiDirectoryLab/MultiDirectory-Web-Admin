import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  id: string = '';
  name: string = '';
  type: DnsRuleType = DnsRuleType.A;
  ip: string = '';
  ttl: number = 3600;

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
