/**
 * Path Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import { calculateRelativePath, relativePathToEnum, relativePathToModel } from '../../utils/path';

describe('Path Utils', () => {
  describe('calculateRelativePath', () => {
    it('should return . for same namespace', () => {
      expect(calculateRelativePath('Users', 'Users')).toBe('.');
    });

    it('should navigate to sibling namespace', () => {
      expect(calculateRelativePath('Users', 'Roles')).toBe('../roles');
    });

    it('should navigate up multiple levels', () => {
      const result = calculateRelativePath('Users.Admin', 'Shared.Models');
      expect(result).toBe('../../shared/models');
    });

    it('should handle shared prefix', () => {
      const result = calculateRelativePath('Users.Admin', 'Users.Settings');
      expect(result).toBe('../settings');
    });

    it('should handle empty namespace', () => {
      expect(calculateRelativePath('', 'Users')).toBe('./users');
    });

    it('should navigate down from empty namespace', () => {
      expect(calculateRelativePath('Users', '')).toBe('..');
    });
  });

  describe('relativePathToEnum', () => {
    it('should add .enum suffix with kebab-cased name', () => {
      const result = relativePathToEnum('Users', 'Users', 'UserStatus');
      expect(result).toBe('./user-status.enum');
    });

    it('should include relative path for different namespaces', () => {
      const result = relativePathToEnum('Users', 'Shared', 'UserStatus');
      expect(result).toBe('../shared/user-status.enum');
    });
  });

  describe('relativePathToModel', () => {
    it('should add /models suffix for same namespace', () => {
      expect(relativePathToModel('Users', 'Users')).toBe('./models');
    });

    it('should include relative path for different namespaces', () => {
      expect(relativePathToModel('Users', 'Shared')).toBe('../shared/models');
    });
  });
});
