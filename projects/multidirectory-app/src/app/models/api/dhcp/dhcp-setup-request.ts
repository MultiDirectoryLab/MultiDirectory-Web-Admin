import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';

export class DhcpSetupRequest {
  subnet?: Subnet;

  constructor(obj?: Partial<DhcpSetupRequest>) {
    Object.assign(this, obj);
  }
}
