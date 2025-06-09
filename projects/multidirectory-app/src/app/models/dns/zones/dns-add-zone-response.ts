export class DnsZoneParam {
  name: string = '';
  value: string = '';

  constructor(obj: Partial<DnsZoneParam>) {
    Object.assign(this, obj);
  }
}

export class DnsAddZoneRequest {
  zone_name: string = '';
  zone_type: string = '';
  params: DnsZoneParam[] = [];
  constructor(obj: Partial<DnsZoneParam>) {
    Object.assign(this, obj);
  }
}
