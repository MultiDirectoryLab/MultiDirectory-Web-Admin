import { DnsRule } from '@models/api/dns/dns-rule';

export class DnsZoneRecordWithType {
  type = '';
  records: DnsRule[] = [];
  constructor(obj: Partial<DnsZoneRecordWithType>) {
    Object.assign(this, obj);
  }
}

export class DnsZoneListResponse {
  name = '';
  type = '';
  records: DnsZoneRecordWithType[] = [];

  constructor(obj: Partial<DnsZoneListResponse>) {
    Object.assign(this, obj);
  }
}
