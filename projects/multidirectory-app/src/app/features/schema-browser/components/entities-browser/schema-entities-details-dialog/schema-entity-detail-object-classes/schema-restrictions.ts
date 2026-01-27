export const SCHEMA_RESTRICTIONS = new Map<string, string[]>([
  ['catalog', ['catalog', 'container', 'top']],
  ['computer', ['computer', 'top']],
  ['container', ['container', 'top']],
  ['domain', ['domain', 'domainDNS', 'top']],
  ['group', ['group', 'posixGroup', 'top']],
  ['krb container', ['krbContainer']],
  ['krb principal', ['krbTicketPolicyAux', 'krbPrincipal', 'krbPrincipalAux']],
  ['krb realm container', ['krbrealmcontainer', 'krbticketpolicyaux', 'top']],
  ['organizational unit', ['conatiner', 'organizationalUnit', 'top']],
  ['user', ['inetOrgPerson', 'organiationalPerson', 'person', 'posixAccount', 'shadowAccount', 'top', 'user']],
  ['contact', ['contact', 'mailRecipient', 'organizationalPerson', 'person', 'top']],
]);
