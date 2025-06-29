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
      filter: '(|(objectClass=builtinDomain)(objectClass=container))',
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
};
