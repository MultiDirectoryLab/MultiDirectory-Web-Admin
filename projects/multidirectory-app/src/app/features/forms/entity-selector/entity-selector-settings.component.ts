import { EntityType } from '@core/entities/entities-type';
import { LdapEntryNode } from '@core/ldap/ldap-entity';

export class EntitySelectorSettings {
  selectedEntities: LdapEntryNode[] = [];
  selectedEntityTypes: EntityType[] = [];
  selectedPlaceDn: string = '';

  allowSelectEntityTypes = true;

  constructor(obj?: Partial<EntitySelectorSettings>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
