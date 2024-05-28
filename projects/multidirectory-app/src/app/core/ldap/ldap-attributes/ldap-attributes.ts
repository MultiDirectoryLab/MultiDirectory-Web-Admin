import { Inject, Injectable } from '@angular/core';
import { PartialAttribute } from './ldap-partial-attribute';

export class LdapAttributes {
  [type: string]: any[];

  constructor(props: PartialAttribute[]) {
    props.forEach((prop) => {
      this[prop.type] = prop.vals;
    });
  }
}
