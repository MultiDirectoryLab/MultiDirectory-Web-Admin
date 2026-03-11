import { DnsRule, DnsRuleResponse } from '@models/api/dns/dns-rule';

export class DnsZoneRecordWithType {
  name: string = '';
  type: string = '';
  records: DnsRule[] = [];
  changetype = null;
  ttl: number = 3600;
  constructor(obj: Partial<DnsZoneRecordWithType>) {
    Object.assign(this, obj);
  }
}
export class DnsZoneRecordWithTypeResponse {
  name: string = '';
  type: string = '';
  records: DnsRuleResponse[] = [];
  changetype = null;
  ttl: number = 3600;
  constructor(obj: Partial<DnsZoneRecordWithType>) {
    Object.assign(this, obj);
  }
}

export class DnsZoneListResponse {
  name = '';
  type = '';
  zone_name? = '';
  id: string = '';
  rrsets: DnsZoneRecordWithTypeResponse[] = [];
  dnssec: boolean = false;
  nameservers: string[] = [];
  kind: string = 'Master';

  constructor(obj: Partial<DnsZoneListResponse>) {
    Object.assign(this, obj);
  }
}
