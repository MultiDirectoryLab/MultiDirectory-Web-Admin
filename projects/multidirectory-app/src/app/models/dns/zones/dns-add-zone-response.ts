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
  ttl = 3600;
  params: DnsZoneParam[] = [];
  constructor(obj: Partial<DnsAddZoneRequest>) {
    Object.assign(this, obj);
  }
}
