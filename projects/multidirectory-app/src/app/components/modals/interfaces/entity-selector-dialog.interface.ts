import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { EntityType } from '@core/entities/entities-type';
import { MultiselectModel } from '@features/access-policy/access-policy-view/multiselect-model';

export interface EntitySelectorDialogData {
  selectedEntities: LdapEntryNode[];
  selectedEntityTypes: EntityType[];
  selectedPlaceDn: string;
  entityToMove: LdapEntryNode[];
  allowSelectEntityTypes: boolean;
}

export type EntitySelectorDialogReturnData = MultiselectModel[];

export class EntitySelectorSettings {
  selectedEntities: LdapEntryNode[] = [];
  selectedEntityTypes: EntityType[] = [];
  selectedPlaceDn: string = '';
  entityToMove: LdapEntryNode[] = [];

  allowSelectEntityTypes = true;

  constructor(obj?: Partial<EntitySelectorSettings>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
