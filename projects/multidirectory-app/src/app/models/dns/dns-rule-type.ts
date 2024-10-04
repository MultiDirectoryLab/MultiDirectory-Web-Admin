import { DropdownOption } from 'multidirectory-ui-kit';

export enum DnsRuleType {
  A = 'A',
  AAAA = 'AAAA',
  PTR = 'PTR',
  CNAME = 'CNAME',
  ANAME = 'ANAME',
  TXT = 'TXT',
  MX = 'MX',
  SRV = 'SRV',
  NS = 'NS',
  CAA = 'CAA',
  SOA = 'SOA',
  SVCB = 'SVCB',
  HTTPS = 'HTTPS',
}

export enum DnsRuleClass {
  IP4 = 1,
  IP6 = 2,
  TEXT = 3,
  EMAIL = 4,
}

export const AvailableDnsRecordTypes = Object.keys(DnsRuleType).map(
  (x, index) =>
    new DropdownOption({
      title: x,
      value: x,
    }),
);

export const DnsTypeToDataType = new Map<DnsRuleType, DnsRuleClass>([
  [DnsRuleType.A, DnsRuleClass.IP4.valueOf()],
  [DnsRuleType.AAAA, DnsRuleClass.IP6.valueOf()],
  [DnsRuleType.CNAME, DnsRuleClass.TEXT.valueOf()],
]);
