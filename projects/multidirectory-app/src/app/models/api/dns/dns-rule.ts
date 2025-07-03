import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  name = '';
  type: DnsRuleType = DnsRuleType.A;
  value = '';
  ttl = 3600;

  static toRequest(obj: DnsRule): any {
    return {
      record_name: obj.name,
      record_type: obj.type,
      record_value: obj.value,
    };
  }

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
