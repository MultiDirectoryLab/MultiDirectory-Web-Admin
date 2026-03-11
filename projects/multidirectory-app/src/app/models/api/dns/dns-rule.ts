import { Constants } from '@core/constants';
import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  record_name: string = '';
  record_type: DnsRuleType = DnsRuleType['A'];
  record_value: string = '';
  ttl?: number = Constants.DnsTTL;

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
export class DnsRuleResponse {
  record_name: string = '';
  record_type: DnsRuleType = DnsRuleType['A'];
  record_value: string = '';
  ttl?: number = Constants.DnsTTL;
  content?: string = '';

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
