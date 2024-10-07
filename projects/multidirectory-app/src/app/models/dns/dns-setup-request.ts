import { DnsStatuses } from './dns-statuses';

export class DnsSetupRequest {
  zone_name: string = '';
  domain: string = '';
  dns_ip_address: string = '';
  default_ttl: string = '8600';
  tsig_key: string = '';
  dns_status: string = DnsStatuses.SELFHOSTED;

  constructor(obj: Partial<DnsSetupRequest>) {
    Object.assign(this, obj);
  }
}
