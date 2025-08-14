import { Constants } from '@core/constants';
import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  name = '';
  type: DnsRuleType = DnsRuleType.A;
  value = '';
  ttl = Constants.DnsTTL;
  zone_name = '';

  static toRequest(obj: DnsRule): any {
    return {
      record_name: obj.name,
      record_type: obj.type,
      record_value: obj.value,
      zone_name: obj.zone_name,
      ttl: obj.ttl,
    };
  }

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
