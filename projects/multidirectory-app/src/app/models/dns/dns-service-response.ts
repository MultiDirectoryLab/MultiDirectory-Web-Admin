import { DnsRule } from './dns-rule';

export class DnsServiceResponse {
  record_type = '';
  records: DnsRule[] = [];

  constructor(obj: Partial<DnsServiceResponse>) {
    Object.assign(this, obj);
  }
}
