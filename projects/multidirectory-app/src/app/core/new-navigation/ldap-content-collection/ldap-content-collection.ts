import { LdapNodePosition } from '../ldap-node-position/ldap-node-position';

export class LdapContentCollection {
  private index: number = 0;

  constructor(private dn: LdapNodePosition) {}
}
