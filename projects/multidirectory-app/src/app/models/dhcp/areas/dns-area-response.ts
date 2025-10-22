import { DnsRule } from '@models/api/dns/dns-rule';

export class DhcpAreaRecordWithType {
  type = '';
  records: DnsRule[] = [];
  constructor(obj: Partial<DhcpAreaRecordWithType>) {
    Object.assign(this, obj);
  }
}

export class DhcpAreaListResponse {
  name = '';
  type = '';
  records: DhcpAreaRecordWithType[] = [];

  constructor(obj: Partial<DhcpAreaListResponse>) {
    Object.assign(this, obj);
  }
}
