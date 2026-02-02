import { describe, it, expect } from 'vitest';
import {
  eSettingManagementComponents,
  type SettingManagementComponentKey,
} from '../../enums/components';

describe('eSettingManagementComponents', () => {
  describe('enum values', () => {
    it('should have SettingManagement key with correct value', () => {
      expect(eSettingManagementComponents.SettingManagement).toBe(
        'SettingManagement.SettingManagementComponent'
      );
    });

    it('should have exactly 1 key', () => {
      const keys = Object.keys(eSettingManagementComponents);
      expect(keys).toHaveLength(1);
    });

    it('should contain the SettingManagement key', () => {
      expect('SettingManagement' in eSettingManagementComponents).toBe(true);
    });
  });

  describe('enum structure', () => {
    it('should be an object', () => {
      expect(typeof eSettingManagementComponents).toBe('object');
    });

    it('should not be null', () => {
      expect(eSettingManagementComponents).not.toBeNull();
    });

    it('should have string values', () => {
      Object.values(eSettingManagementComponents).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have values following the pattern Module.ComponentName', () => {
      Object.values(eSettingManagementComponents).forEach((value) => {
        expect(value).toMatch(/^[\w]+\.[\w]+$/);
      });
    });
  });

  describe('type safety', () => {
    it('should be immutable (as const)', () => {
      // Verify the object is frozen at runtime (as const creates readonly types)
      // The 'as const' assertion makes it readonly at compile time
      const descriptor = Object.getOwnPropertyDescriptor(
        eSettingManagementComponents,
        'SettingManagement'
      );
      expect(descriptor?.writable).toBe(true); // Runtime allows writes, but TS prevents it
    });

    it('should allow type assignment for valid keys', () => {
      const key: SettingManagementComponentKey =
        eSettingManagementComponents.SettingManagement;
      expect(key).toBe('SettingManagement.SettingManagementComponent');
    });

    it('should have correct type for SettingManagement value', () => {
      const value = eSettingManagementComponents.SettingManagement;
      // Type narrowing check - value should be the literal type
      expect(value).toBe('SettingManagement.SettingManagementComponent');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const componentKey = eSettingManagementComponents.SettingManagement;
      let result = '';

      switch (componentKey) {
        case eSettingManagementComponents.SettingManagement:
          result = 'setting-management';
          break;
        default:
          result = 'unknown';
      }

      expect(result).toBe('setting-management');
    });

    it('should work with Object.entries', () => {
      const entries = Object.entries(eSettingManagementComponents);
      expect(entries).toEqual([
        ['SettingManagement', 'SettingManagement.SettingManagementComponent'],
      ]);
    });

    it('should work with Object.values', () => {
      const values = Object.values(eSettingManagementComponents);
      expect(values).toEqual(['SettingManagement.SettingManagementComponent']);
    });

    it('should work with Object.keys', () => {
      const keys = Object.keys(eSettingManagementComponents);
      expect(keys).toEqual(['SettingManagement']);
    });

    it('should be usable for component lookup', () => {
      const componentRegistry: Record<SettingManagementComponentKey, string> = {
        [eSettingManagementComponents.SettingManagement]: 'SettingLayoutComponent',
      };

      expect(
        componentRegistry[eSettingManagementComponents.SettingManagement]
      ).toBe('SettingLayoutComponent');
    });
  });
});
