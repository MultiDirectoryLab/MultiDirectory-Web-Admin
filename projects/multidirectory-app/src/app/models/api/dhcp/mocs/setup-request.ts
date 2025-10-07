import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';

export const setupStartValue: DhcpSetupRequest = [
  {
    name: 'localhost',
    type: 'master',
    records: [
      {
        type: 'SOA',
        records: [
          {
            name: 'localhost.',
            value: 'ns1.localhost. support.md.ru. 1 10800 3600 604800 21600',
            ttl: 604800,
          },
        ],
      },
      {
        type: 'NS',
        records: [
          {
            name: 'localhost.',
            value: 'ns1.localhost.',
            ttl: 604800,
          },
          {
            name: 'localhost.',
            value: 'ns2.localhost.',
            ttl: 604800,
          },
        ],
      },
      {
        type: 'A',
        records: [
          {
            name: 'localhost.',
            value: '127.0.0.2',
            ttl: 604800,
          },
          {
            name: '123123\\@.localhost.',
            value: '8.8.8.8',
            ttl: 604800,
          },
          {
            name: '\\@.localhost.',
            value: '8.8.8.8',
            ttl: 604800,
          },
          {
            name: 'ns1.localhost.',
            value: '127.0.0.2',
            ttl: 604800,
          },
          {
            name: 'ns2.localhost.',
            value: '127.0.0.1',
            ttl: 604800,
          },
        ],
      },
      {
        type: 'SRV',
        records: [
          {
            name: '_kdc._tcp.localhost.',
            value: '0 0 88 localhost.',
            ttl: 604800,
          },
          {
            name: '_kerberos._tcp.localhost.',
            value: '0 0 88 localhost.',
            ttl: 604800,
          },
          {
            name: '_kpasswd._tcp.localhost.',
            value: '0 0 464 localhost.',
            ttl: 604800,
          },
          {
            name: '_ldap._tcp.localhost.',
            value: '0 0 389 localhost.',
            ttl: 604800,
          },
          {
            name: '_ldaps._tcp.localhost.',
            value: '0 0 636 localhost.',
            ttl: 604800,
          },
          {
            name: '_kdc._udp.localhost.',
            value: '0 0 88 localhost.',
            ttl: 604800,
          },
          {
            name: '_kerberos._udp.localhost.',
            value: '0 0 88 localhost.',
            ttl: 604800,
          },
          {
            name: '_kpasswd._udp.localhost.',
            value: '0 0 464 localhost.',
            ttl: 604800,
          },
        ],
      },
    ],
  },
];
