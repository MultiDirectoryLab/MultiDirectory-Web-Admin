import { EntityAttributeType } from './entity-attribute-type';
import { EntityAttributeTypeResolver } from './entity-attribute-type-resolver';

describe('EntityAttributeTypeResolver', () => {
  describe('getPropertyDescription', () => {
    it('should return the first descriptor when oid is null', () => {
      const result = EntityAttributeTypeResolver.getPropertyDescription(null);

      expect(result).toBeDefined();
      expect(result?.id).toBe('');
      expect(result?.description).toBe('Directory String');
      expect(result?.type).toBe(EntityAttributeType.String);
      expect(result?.isArray).toBe(false);
    });

    it('should return the correct descriptor when a valid oid is provided', () => {
      const oid = '1.3.6.1.4.1.1466.115.121.1.15';
      const result = EntityAttributeTypeResolver.getPropertyDescription(oid);

      expect(result).toBeDefined();
      expect(result?.id).toBe(oid);
      expect(result?.description).toBe('Directory String');
      expect(result?.type).toBe(EntityAttributeType.String);
      expect(result?.isArray).toBe(false);
    });

    it('should return the correct multi-valued string descriptor', () => {
      const oid = '1.3.6.1.4.1.1466.115.121.1.38';
      const result = EntityAttributeTypeResolver.getPropertyDescription(oid);

      expect(result).toBeDefined();
      expect(result?.id).toBe(oid);
      expect(result?.description).toBe('Multivalued String');
      expect(result?.type).toBe(EntityAttributeType.MultivaluedString);
      expect(result?.isArray).toBe(true);
    });

    it('should return undefined for an unknown oid', () => {
      const result = EntityAttributeTypeResolver.getPropertyDescription('unknown-oid');

      expect(result).toBeUndefined();
    });
  });

  describe('getDefault', () => {
    it('should return the first descriptor as the default', () => {
      const defaultDescriptor = EntityAttributeTypeResolver.getDefault();

      expect(defaultDescriptor).toBeDefined();
      expect(defaultDescriptor.id).toBe('');
      expect(defaultDescriptor.description).toBe('Directory String');
      expect(defaultDescriptor.type).toBe(EntityAttributeType.String);
      expect(defaultDescriptor.isArray).toBe(false);
    });
  });

  describe('EntityAttributeType', () => {
    it('should have correct enum values', () => {
      expect(EntityAttributeType.String).toBe('String');
      expect(EntityAttributeType.Integer).toBe('Integer');
      expect(EntityAttributeType.MultivaluedString).toBe('MultivaluedString');
    });
  });
});
