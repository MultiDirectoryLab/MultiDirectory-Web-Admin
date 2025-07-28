import { SearchRequest } from '@models/api/entry/search-request';

export const SearchQueries = {
  RootDse: {
    base_object: '',
    scope: 0,
    deref_aliases: 0,
    size_limit: 0,
    time_limit: 0,
    types_only: false,
    filter: '(objectClass=*)',
    attributes: [
      'defaultNamingContext',
      'namingContexts',
      'subschemaSubentry',
      'supportedLDAPVersion',
      'supportedSASLMechanisms',
      'supportedExtension',
      'supportedControl',
      'supportedFeatures',
      'vendorName',
      'name',
      'vendorVersion',
      'objectClass',
    ],
  },

  getChildren(baseObject: string): SearchRequest {
    return new SearchRequest({
      base_object: baseObject,
      scope: 1,
      deref_aliases: 0,
      size_limit: 0,
      time_limit: 0,
      types_only: false,
      filter:
        '(|(objectClass=builtinDomain)(objectClass=container)(objectClass=krbContainer)(objectClass=krbrealmcontainer))',
      attributes: ['defaultNamingContext', 'sAMAccountName', 'name', 'objectClass'],
    });
  },

  getContent(baseObject: string, query: string = '', offset = 0, limit = 0): SearchRequest {
    const req = new SearchRequest({
      base_object: baseObject,
      scope: 1,
      deref_aliases: 0,
      size_limit: limit,
      time_limit: 0,
      types_only: false,
      filter: query ? `(&(objectClass=*)(cn=*${query}*))` : '(objectClass=*)',
      attributes: [
        'defaultNamingContext',
        'sAMAccountName',
        'name',
        'objectClass',
        'userAccountControl',
        'entityTypeName',
        'description',
      ],
      page_number: Math.floor(offset / Math.max(limit, 1) + 1),
    });
    return req;
  },

  getProperites(baseObject: string): SearchRequest {
    return new SearchRequest({
      base_object: baseObject,
      scope: 0,
      deref_aliases: 0,
      size_limit: 0,
      time_limit: 0,
      types_only: false,
      filter: '(objectClass=*)',
      attributes: ['*'],
    });
  },

  findByName(name: string, baseObject: string): SearchRequest {
    return new SearchRequest({
      base_object: baseObject,
      scope: 2,
      deref_aliases: 0,
      size_limit: 0,
      time_limit: 0,
      types_only: false,
      filter: `(|(cn=*${name}*)(displayName=*${name}*)(name=*${name}*))`,
      attributes: ['*'],
    });
  },

  findAccessGroups(baseObject: string): SearchRequest {
    return new SearchRequest({
      base_object: baseObject,
      scope: 2,
      deref_aliases: 0,
      size_limit: 0,
      time_limit: 0,
      types_only: false,
      filter: '(|(objectClass=group))',
      attributes: ['*'],
    });
  },

  findEntities(name: string, baseDn: string, entityType: string[] = []): SearchRequest {
    let typeQuery = '(!(objectClass=krbprincipal))';
    if (entityType.length > 0) {
      const entityTypes = entityType.map((x) => `(objectClass=${x})`).join('');
      typeQuery = `(|${entityTypes})`;
    }
    return new SearchRequest({
      base_object: baseDn,
      scope: 2,
      deref_aliases: 0,
      size_limit: 0,
      time_limit: 0,
      types_only: false,
      filter: `(&${typeQuery}(|(displayName=*${name}*)(cn=*${name}*)(name=*${name}*)))`,
      attributes: ['displayName', 'cn', 'distinguishedName', 'name'],
    });
  },

  getSchema(): SearchRequest {
    return new SearchRequest({
      base_object: 'CN=Schema',
      scope: 0,
      deref_aliases: 0,
      size_limit: 0,
      time_limit: 0,
      types_only: false,
      filter: '(objectClass=*)',
      attributes: ['*'],
    });
  },

  getKdcPrincipals(baseDn: string, query: string): SearchRequest {
    return new SearchRequest({
      base_object: baseDn,
      scope: 3,
      deref_aliases: 0,
      size_limit: 1000,
      time_limit: 1000,
      types_only: true,
      filter: query ? `(&(objectClass=krbprincipal)(cn=*${query}*))` : '(objectClass=krbprincipal)',
      attributes: ['cn'],
      page_number: 1,
    });
  },

  mapEntityTypeName(entityName: string) {
    const nameToIndexMap = {
      Domain: 1,
      Computer: 2,
      Container: 3,
      Catalog: 4,
      'Organizational Unit': 5,
      Group: 6,
      User: 7,
      'KRB Container': 8,
      'KRB Principal': 9,
      'KRB Realm Container': 10,
    };

    // Convert input to title case for case-insensitive matching
    const formattedName = entityName.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase());

    return Object.entries(nameToIndexMap).find((entry) => entry[0] == formattedName)?.[1] || ''; // Returns -1 if name not found
  },

  getSchemaEntityEntries(baseDn: string, entityName: string, offset: number, limit: number) {
    return new SearchRequest({
      base_object: baseDn,
      scope: 2,
      size_limit: limit,
      time_limit: 1000,
      filter: `(|(entityTypeName=${entityName}))`,
      attributes: ['displayName', 'distinguishedName', 'name', 'cn', 'entityTypeName'],
      page_number: Math.floor(offset / limit) + 1,
    });
  },

  getSchemaObjectClassEntries(baseDn: string, objectClass: string, offset: number, limit: number) {
    return new SearchRequest({
      base_object: baseDn,
      scope: 2,
      size_limit: limit,
      time_limit: 1000,
      filter: `(|(objectClass=${objectClass}))`,
      attributes: [
        'displayName',
        'distinguishedName',
        'objectClass',
        'name',
        'cn',
        'entityTypeName',
      ],
      page_number: Math.floor(offset / limit) + 1,
    });
  },
};
