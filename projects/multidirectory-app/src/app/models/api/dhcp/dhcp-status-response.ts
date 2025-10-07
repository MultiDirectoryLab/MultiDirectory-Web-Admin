import { DhcpStatuses } from './dhcp-statuses';

export class DhcpStatusResponse {
  zone_name = '';
  dns_server_ip = '';
  dns_status: DhcpStatuses = DhcpStatuses.NOT_CONFIGURED;

  constructor(obj: Partial<DhcpStatusResponse>) {
    Object.assign(this, obj);
  }
}
