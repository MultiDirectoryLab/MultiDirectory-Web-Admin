export class EntityType {
  entity: string = '';
  name: string = '';
  id: string = '';

  constructor(obj: Partial<EntityType>) {
    Object.assign(this, obj);
  }
}
