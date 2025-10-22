import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';

export class DhcpSetupRequest {
  dhcp_manager_state: string = '0';

  constructor(obj?: Partial<DhcpSetupRequest>) {
    Object.assign(this, obj);
  }
}
