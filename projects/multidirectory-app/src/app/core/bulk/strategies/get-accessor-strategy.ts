import { Injectable } from '@angular/core';
import { BulkPerformStrategy } from '../bulk-perfrom-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AttributeService } from '@services/attributes.service';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { NavigationNode } from '@models/core/navigation/navigation-node';

@Injectable({
  providedIn: 'root',
})
export class GetAccessorStrategy extends BulkPerformStrategy<NavigationNode> {
  constructor(private attributeService: AttributeService) {
    super();
  }

  override mutate<LdapAttributes>(entry: NavigationNode): LdapAttributes {
    const attributes = [] as LdapAttribute[]; //entry.entry?.partial_attributes ?? [];
    const accessor = this.attributeService.getTrackableAttributes(
      entry,
      new LdapAttributes(attributes),
    );
    return accessor as LdapAttributes;
  }
}
