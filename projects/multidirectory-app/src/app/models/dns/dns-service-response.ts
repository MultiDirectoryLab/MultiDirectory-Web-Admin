import { DnsRule } from './dns-rule';

export class DnsServiceResponse {
  record_type: string = '';
  records: DnsRule[] = [];

  constructor(obj: Partial<DnsServiceResponse>) {
    Object.assign(this, obj);
  }
}
