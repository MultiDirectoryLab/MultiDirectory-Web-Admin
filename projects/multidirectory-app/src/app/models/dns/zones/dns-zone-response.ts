import { DnsRule } from '@models/api/dns/dns-rule';

export class DnsZoneRecordWithType {
  record_type = '';
  records: DnsRule[] = [];
  constructor(obj: Partial<DnsZoneRecordWithType>) {
    Object.assign(this, obj);
  }
}

export class DnsZoneListResponse {
  zone_name = '';
  zone_type = '';
  records: DnsZoneRecordWithType[] = [];

  constructor(obj: Partial<DnsZoneListResponse>) {
    Object.assign(this, obj);
  }
}
