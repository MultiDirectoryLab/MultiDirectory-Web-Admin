import { Constants } from '@core/constants';
import { DnsStatuses } from '@models/api/dns/dns-statuses';

export class DhcpStatusRequest {
  constructor(obj: Partial<DhcpStatusRequest>) {
    Object.assign(this, obj);
  }
}

export interface DhcpStatusResponse {
  dhcp_manager_state: string;
}
