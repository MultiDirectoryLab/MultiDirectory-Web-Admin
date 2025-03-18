import { Injectable } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapAttributesProxyHandler } from '@core/ldap/ldap-attributes/ldap-attributes-proxy';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';
import { ChangeDescription } from '@core/ldap/ldap-change';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapChange, LdapOperation, UpdateEntryRequest } from '@models/api/entry/update-request';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  getChanges(attribute: LdapAttributes): ChangeDescription[] {
    // to add
    const toAdd = Object.entries(attribute)
      .filter((keyValue) => {
        const old = attribute['$' + keyValue[0]];
        return !old;
      })
      .map(
        (keyValue) =>
          new ChangeDescription({
            operation: LdapOperation.Add,
            attribute: new PartialAttribute({
              type: keyValue[0],
              vals: keyValue[1],
            }),
          }),
      );

    const toReplace = Object.entries(attribute)
      .filter((keyValue) => {
        const old = attribute['$' + keyValue[0]];
        return (
          !!old &&
          (old.length !== keyValue[1].length ||
            !old.every((v: any, i: any) => v === keyValue[1][i]))
        );
      })
      .map(
        (keyValue) =>
          new ChangeDescription({
            operation: LdapOperation.Replace,
            attribute: new PartialAttribute({
              type: keyValue[0],
              vals: keyValue[1],
            }),
          }),
      );
    const toDelete = Object.entries(attribute)
      .filter((keyValue) => {
        const old = attribute['$' + keyValue[0]];
        return !!old && keyValue[1].length === 0;
      })
      .map(
        (keyValue) =>
          new ChangeDescription({
            operation: LdapOperation.Delete,
            attribute: new PartialAttribute({
              type: keyValue[0],
              vals: keyValue[1],
            }),
          }),
      );
    return toAdd.concat(toReplace).concat(toDelete);
  }

  getTrackableAttributes(node: LdapEntryNode, attributes: LdapAttributes): LdapAttributes {
    const handler = new LdapAttributesProxyHandler(node, attributes);
    return new Proxy(attributes, handler);
  }

  createAttributeUpdateRequest(accessor: LdapAttributes): UpdateEntryRequest {
    const changes = this.getChanges(accessor);
    const request = new UpdateEntryRequest({
      object: accessor['$entityDN'][0],
      changes: changes.map(
        (x) =>
          new LdapChange({
            operation: x.operation!,
            modification: x.attribute!,
          }),
      ),
    });
    return request;
  }
}
