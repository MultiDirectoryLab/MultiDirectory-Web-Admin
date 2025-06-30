import { DnsAddZoneRequest, DnsZoneParam } from '@models/dns/zones/dns-add-zone-response';

export class DnsForwardZone {
  name: string = '';
  type: string = 'forward';
  forwarders: string[] = ['127.0.0.1', '127.0.0.2'];
  constructor(obj: Partial<DnsForwardZone>) {
    Object.assign(this, obj);
  }
  toDnsAddZoneRequest(): DnsAddZoneRequest {
    return new DnsAddZoneRequest({
      zone_name: this.name,
      zone_type: this.type,
      params: [
        new DnsZoneParam({
          name: 'forwarders',
          value: this.forwarders,
        }),
      ],
    });
  }
}
