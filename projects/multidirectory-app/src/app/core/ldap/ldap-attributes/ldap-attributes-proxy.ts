import { NavigationNode } from '@models/core/navigation/navigation-node';
import { ChangeDescription } from '../ldap-change';
import { LdapAttributes } from './ldap-attributes';

export class LdapAttributesProxyHandler {
  _original: LdapAttributes;
  _entity: NavigationNode;
  _changes: ChangeDescription[] = [];

  constructor(entity: NavigationNode, attributes: LdapAttributes) {
    this._original = JSON.parse(JSON.stringify(attributes));
    this._entity = entity;
  }

  get(target: LdapAttributes, key: string) {
    if (key.toLocaleLowerCase() == '$entitydn') {
      return [this._entity.id];
    }

    if (key.toLocaleLowerCase() == '$changes') {
      return this._changes;
    }

    if (key.startsWith('$')) {
      return this._original[key.slice(1)];
    }
    return target[key];
  }

  set(target: LdapAttributes, key: string, value: string[] | string | ChangeDescription[]) {
    if (
      key == '$changes' &&
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof ChangeDescription
    ) {
      this._changes = value as ChangeDescription[];
    } else if (Array.isArray(value)) {
      target[key] = value.map((x) => x) as string[];
    } else {
      target[key] = [value];
    }
    return true;
  }
}
