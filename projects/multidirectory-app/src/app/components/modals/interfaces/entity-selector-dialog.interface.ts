import { EntityType } from '@core/entities/entities-type';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';

export interface EntitySelectorDialogData {
  selectedEntities: MultiselectModel[];
  selectedEntityTypes: EntityType[];
  selectedPlaceDn: string;
  entityToMove: NavigationNode[];
  allowSelectEntityTypes: boolean;
}

export type EntitySelectorDialogReturnData = MultiselectModel[];

export class EntitySelectorSettings {
  selectedEntities: MultiselectModel[] = [];
  selectedEntityTypes: EntityType[] = [];
  selectedPlaceDn = '';
  entityToMove: NavigationNode[] = [];

  allowSelectEntityTypes = true;

  constructor(obj?: Partial<EntitySelectorSettings>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
