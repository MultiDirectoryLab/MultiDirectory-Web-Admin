import { EntityType } from '@core/entities/entities-type';
import { NavigationNode } from '@models/core/navigation/navigation-node';

export class EntitySelectorSettings {
  selectedEntities: NavigationNode[] = [];
  selectedEntityTypes: EntityType[] = [];
  selectedPlaceDn: string = '';
  entityToMove: NavigationNode[] = [];

  allowSelectEntityTypes = true;

  constructor(obj?: Partial<EntitySelectorSettings>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
