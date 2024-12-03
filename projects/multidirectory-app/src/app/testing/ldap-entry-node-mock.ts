import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';

export const LdapNodeMock: LdapEntryNode = new LdapEntryNode({
  id: 'cn=adminlogin,ou=users,dc=md,dc=localhost,dc=dev',
  type: LdapEntryType.Computer,
  entry: {
    object_name: 'cn=adminlogin,ou=users,dc=md,dc=localhost,dc=dev',
    partial_attributes: [
      {
        type: 'cn',
        vals: ['adminlogin'],
      },
      {
        type: 'objectClass',
        vals: ['top', 'person', 'organizationalPerson', 'posixAccount', 'shadowAccount', 'user'],
      },
      {
        type: 'pwdLastSet',
        vals: ['133771931368868320'],
      },
      {
        type: 'loginShell',
        vals: ['/bin/bash'],
      },
      {
        type: 'uidNumber',
        vals: ['1000'],
      },
      {
        type: 'gidNumber',
        vals: ['513'],
      },
      {
        type: 'userAccountControl',
        vals: ['512'],
      },
      {
        type: 'homeDirectory',
        vals: ['/home/adminlogin'],
      },
      {
        type: 'distinguishedName',
        vals: ['cn=adminlogin,ou=users,dc=md,dc=localhost,dc=dev'],
      },
      {
        type: 'whenCreated',
        vals: ['20241127145856.0Z'],
      },
      {
        type: 'accountExpires',
        vals: ['0'],
      },
      {
        type: 'lastLogon',
        vals: ['133772644630000000'],
      },
      {
        type: 'authTimestamp',
        vals: ['2024-11-28 10:47:43.388728+00:00'],
      },
      {
        type: 'memberOf',
        vals: ['cn=domain admins,cn=groups,dc=md,dc=localhost,dc=dev'],
      },
      {
        type: 'mail',
        vals: ['adminlogin@md.localhost.dev'],
      },
      {
        type: 'sAMAccountName',
        vals: ['adminlogin'],
      },
      {
        type: 'userPrincipalName',
        vals: ['adminlogin@md.localhost.dev'],
      },
      {
        type: 'displayName',
        vals: ['adminlogin'],
      },
      {
        type: 'uid',
        vals: ['adminlogin'],
      },
      {
        type: 'name',
        vals: ['adminlogin'],
      },
      {
        type: 'objectGUID',
        vals: ['cefb172944077144861f87538a335397'],
      },
      {
        type: 'objectSid',
        vals: ['01050000000000051500000067b0e16135d205bf8094df12f4010000'],
      },
    ],
  },
});
