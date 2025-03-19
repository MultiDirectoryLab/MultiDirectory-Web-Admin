import { LdapAttribute } from './ldap-attribute';

export class LdapAttributes {
  [type: string]: any[];

  constructor(props: LdapAttribute[]) {
    props.forEach((prop) => {
      this[prop.type] = prop.vals;
    });
  }
}
