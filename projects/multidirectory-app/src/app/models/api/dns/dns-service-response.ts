import { DnsRule } from './dns-rule';

export class DnsServiceResponse {
  type = '';
  records: DnsRule[] = [];

  constructor(obj: Partial<DnsServiceResponse>) {
    Object.assign(this, obj);
  }
}
