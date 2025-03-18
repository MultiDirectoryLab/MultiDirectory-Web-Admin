import { LdapEntryNode } from '@models/core/ldap/ldap-entity';
import { LdapEntryType } from '@models/core/ldap/ldap-entity-type';

export const LdapNodeMock: LdapEntryNode = new LdapEntryNode({
  id: 'cn=adminlogin,ou=users,dc=md,dc=localhost,dc=dev',
  type: LdapEntryType.Computer,
});
