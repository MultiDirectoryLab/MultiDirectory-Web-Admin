import { DnsStatuses } from './dns-statuses';

export class DnsStatusResponse {
  zone_name = '';
  dns_server_ip = '';
  dns_status: DnsStatuses = DnsStatuses.NOT_CONFIGURED;

  constructor(obj: Partial<DnsStatusResponse>) {
    Object.assign(this, obj);
  }
}
