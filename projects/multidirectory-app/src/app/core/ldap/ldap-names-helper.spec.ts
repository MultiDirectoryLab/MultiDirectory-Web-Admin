import { LdapNamesHelper } from './ldap-names-helper';

describe('LdapNamesHelper', () => {
  describe('getDnParent', () => {
    it('should return the parent DN when a valid DN is provided', () => {
      const dn = 'cn=John Doe,ou=Users,dc=example,dc=com';
      const result = LdapNamesHelper.getDnParent(dn);
      expect(result).toBe('ou=Users,dc=example,dc=com');
    });

    it('should return an empty string if the DN starts with "dc="', () => {
      const dn = 'dc=example,dc=com';
      const result = LdapNamesHelper.getDnParent(dn);
      expect(result).toBe('');
    });

    it('should return an empty string if the DN is empty or null', () => {
      expect(LdapNamesHelper.getDnParent('')).toBe('');
      expect(LdapNamesHelper.getDnParent(null as unknown as string)).toBe('');
    });
  });

  describe('getDnName', () => {
    it('should return the first part of the DN when a valid DN is provided', () => {
      const dn = 'cn=John Doe,ou=Users,dc=example,dc=com';
      const result = LdapNamesHelper.getDnName(dn);
      expect(result).toBe('cn=John Doe');
    });

    it('should return the entire DN if it contains only one part', () => {
      const dn = 'dc=example';
      const result = LdapNamesHelper.getDnName(dn);
      expect(result).toBe('dc=example');
    });

    it('should return an empty string if the DN is empty or null', () => {
      expect(LdapNamesHelper.getDnName('')).toBe('');
      expect(LdapNamesHelper.getDnName(null as unknown as string)).toBe('');
    });
  });

  describe('isDnChild', () => {
    it('should return true if the child DN is a direct child of the parent DN', () => {
      const parentDn = 'ou=Users,dc=example,dc=com';
      const childDn = 'cn=John Doe,ou=Users,dc=example,dc=com';
      const result = LdapNamesHelper.isDnChild(parentDn, childDn);
      expect(result).toBe(true);
    });

    it('should return false if the child DN is not a direct child of the parent DN', () => {
      const parentDn = 'ou=Users,dc=example,dc=com';
      const childDn = 'ou=Admins,dc=example,dc=com';
      const result = LdapNamesHelper.isDnChild(parentDn, childDn);
      expect(result).toBe(false);
    });

    it('should return false if the child DN is a sibling of the parent DN', () => {
      const parentDn = 'ou=Users,dc=example,dc=com';
      const childDn = 'ou=Groups,dc=example,dc=com';
      const result = LdapNamesHelper.isDnChild(parentDn, childDn);
      expect(result).toBe(false);
    });

    it('should return false if the child DN is empty or null', () => {
      const parentDn = 'ou=Users,dc=example,dc=com';
      expect(LdapNamesHelper.isDnChild(parentDn, '')).toBe(false);
      expect(LdapNamesHelper.isDnChild(parentDn, null as unknown as string)).toBe(false);
    });

    it('should return false if the parent DN is empty or null', () => {
      const childDn = 'cn=John Doe,ou=Users,dc=example,dc=com';
      expect(LdapNamesHelper.isDnChild('', childDn)).toBe(false);
      expect(LdapNamesHelper.isDnChild(null as unknown as string, childDn)).toBe(false);
    });

    it('should return false if the parent DN is not a prefix of the child DN', () => {
      const parentDn = 'ou=Admins,dc=example,dc=com';
      const childDn = 'cn=John Doe,ou=Users,dc=example,dc=com';
      const result = LdapNamesHelper.isDnChild(parentDn, childDn);
      expect(result).toBe(false);
    });

    it('should return false if the child DN contains additional unrelated parts', () => {
      const parentDn = 'ou=Users,dc=example,dc=com';
      const childDn = 'cn=John Doe,ou=Users,ou=Extra,dc=example,dc=com';
      const result = LdapNamesHelper.isDnChild(parentDn, childDn);
      expect(result).toBe(false);
    });
  });
});
