import { Constants } from '@core/constants';

export class DnsZoneParam {
  name: string = '';
  value: string | string[] = '';

  constructor(obj: Partial<DnsZoneParam>) {
    Object.assign(this, obj);
  }
}

export class DnsAddZoneRequest {
  zone_name: string = '';
  zone_type: string = '';
  ttl = Constants.DnsTTL;
  parameters: DnsZoneParam[] = [];
  constructor(obj: Partial<DnsAddZoneRequest>) {
    Object.assign(this, obj);
  }
}
