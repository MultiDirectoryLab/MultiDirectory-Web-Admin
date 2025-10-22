import { DnsZoneParam } from '@models/dhcp/areas/dhcp-add-areas-response';

export class DhcpCreateLeaseRequest {
  subnet_id: string = '';
  ip_address: string = '';
  mac_address: string = '';
  hostname: string = '';
  validLifetime: string = '';

  constructor(obj: Partial<DhcpCreateLeaseRequest>) {
    Object.assign(this, obj);
  }
}
