import { DnsStatuses } from './dns-statuses';

export class DnsSetupRequest {
  zone_name = '';
  domain = '';
  dns_ip_address?: string = undefined;
  default_ttl = 8600;
  tsig_key?: string = undefined;
  dns_status: string = DnsStatuses.SELFHOSTED;

  constructor(obj: Partial<DnsSetupRequest>) {
    Object.assign(this, obj);
  }
}
