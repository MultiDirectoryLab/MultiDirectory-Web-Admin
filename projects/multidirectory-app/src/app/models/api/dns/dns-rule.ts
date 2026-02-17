import { Constants } from '@core/constants';
import { DnsRuleType } from './dns-rule-type';

export class DnsRule {
  record_name: string = '';
  record_type: DnsRuleType = DnsRuleType['A'];
  record_value: string = '0 100 3268 md.localhost.';
  ttl?: number = Constants.DnsTTL;
  content?: string = '0 100 3268 md.localhost.';

  constructor(obj: Partial<DnsRule>) {
    Object.assign(this, obj);
  }
}
