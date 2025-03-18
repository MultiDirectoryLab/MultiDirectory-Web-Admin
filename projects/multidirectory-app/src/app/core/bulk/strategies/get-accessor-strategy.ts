import { Injectable, inject } from '@angular/core';
import { BulkPerformStrategy } from '../bulk-perfrom-strategy';
import { LdapEntryNode } from '@models/core/ldap/ldap-entity';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AttributeService } from '@services/attributes.service';
import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

@Injectable({
  providedIn: 'root',
})
export class GetAccessorStrategy extends BulkPerformStrategy<LdapEntryNode> {
  private attributeService = inject(AttributeService);

  override mutate<LdapAttributes>(entry: LdapEntryNode): LdapAttributes {
    const attributes = [] as PartialAttribute[]; //entry.entry?.partial_attributes ?? [];
    const accessor = this.attributeService.getTrackableAttributes(
      entry,
      new LdapAttributes(attributes),
    );
    return accessor as LdapAttributes;
  }
}
