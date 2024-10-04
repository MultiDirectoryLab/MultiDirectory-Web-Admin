import { DnsStatuses } from './dns-statuses';

export class DnsStatusResponse {
  zone_name: string = '';
  dns_server_ip: string = '5.35.9.32';
  dns_status: DnsStatuses = DnsStatuses.NOT_CONFIGURED;

  constructor(obj: Partial<DnsStatusResponse>) {
    Object.assign(this, obj);
  }
}
