import { EntityType } from './entities-type';

export const ENTITY_TYPES = [
  new EntityType({ entity: 'group', id: 'BuiltInPrincipal', name: 'Built-in Security Principals' }),
  new EntityType({ entity: 'group', id: 'Groups', name: 'Группы' }),
  new EntityType({ entity: 'user', id: 'Users', name: 'Пользователи' }),
  new EntityType({
    entity: 'ou,catalog,organizationalUnit,container',
    id: 'catalogs',
    name: 'Каталоги',
  }),
];
