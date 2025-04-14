export class EntityType {
  entity = '';
  name = '';
  id = '';

  constructor(obj: Partial<EntityType>) {
    Object.assign(this, obj);
  }
}
