import { DnsAddZoneRequest, DnsZoneParam } from '@models/dhcp/areas/dhcp-add-areas-response';

export class DnsForwardZone {
  zone_name: string = '';
  servers: string[] = ['127.0.0.1', '127.0.0.2'];
  constructor(obj: Partial<DnsForwardZone>) {
    Object.assign(this, obj);
  }
}

export class DnsForwardGetData {
  id: string = '';
  name: string = '';
  rrsets: string[] = [];
  type: string = 'zone';
  servers: string[] = [];
  recursion_desired: boolean = false;
  kind: string = '';

  constructor(obj: Partial<DnsForwardGetData>) {
    Object.assign(this, obj);
  }
}
