import { DnsZoneParam } from '@models/dhcp/areas/dhcp-add-areas-response';

export class DhcpCreateReservationRequest {
  subnet_id: string = '';
  ip_address: string = '';
  mac_address: string = '';
  hostname: string = '';

  constructor(obj: Partial<DhcpCreateReservationRequest>) {
    Object.assign(this, obj);
  }
}
export class DhcpDeleteReservationRequest {
  subnet_id: string = '';
  ip_address: string = '';
  mac_address: string = '';

  constructor(obj: Partial<DhcpDeleteReservationRequest>) {
    Object.assign(this, obj);
  }
}
