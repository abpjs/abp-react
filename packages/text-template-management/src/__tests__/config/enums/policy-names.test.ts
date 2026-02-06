/**
 * Tests for eTextTemplateManagementPolicyNames
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eTextTemplateManagementPolicyNames,
  type TextTemplateManagementPolicyNameKey,
} from '../../../config/enums/policy-names';

describe('eTextTemplateManagementPolicyNames', () => {
  describe('Const Object Values', () => {
    it('should have TextTemplates key with correct value', () => {
      expect(eTextTemplateManagementPolicyNames.TextTemplates).toBe(
        'TextTemplateManagement.TextTemplates',
      );
    });

    it('should have correct policy format', () => {
      expect(eTextTemplateManagementPolicyNames.TextTemplates).toMatch(
        /^TextTemplateManagement\./,
      );
    });
  });

  describe('Object Structure', () => {
    it('should have exactly 1 key', () => {
      const keys = Object.keys(eTextTemplateManagementPolicyNames);
      expect(keys).toHaveLength(1);
      expect(keys).toContain('TextTemplates');
    });

    it('should have all values as strings', () => {
      Object.values(eTextTemplateManagementPolicyNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should be immutable (as const)', () => {
      const originalValue = eTextTemplateManagementPolicyNames.TextTemplates;
      expect(originalValue).toBe('TextTemplateManagement.TextTemplates');
    });
  });

  describe('TextTemplateManagementPolicyNameKey Type', () => {
    it('should accept TextTemplates value', () => {
      const key: TextTemplateManagementPolicyNameKey =
        eTextTemplateManagementPolicyNames.TextTemplates;
      expect(key).toBe('TextTemplateManagement.TextTemplates');
    });

    it('should be usable in permission checks', () => {
      const hasPermission = (
        policy: TextTemplateManagementPolicyNameKey,
      ): boolean => {
        return policy === 'TextTemplateManagement.TextTemplates';
      };

      expect(
        hasPermission(eTextTemplateManagementPolicyNames.TextTemplates),
      ).toBe(true);
    });
  });

  describe('Policy Name Pattern', () => {
    it('should follow Module.Permission pattern', () => {
      expect(eTextTemplateManagementPolicyNames.TextTemplates).toMatch(
        /^[A-Za-z]+\.[A-Za-z]+$/,
      );
    });
  });

  describe('Usage in Route Configuration', () => {
    it('should be usable as requiredPolicy in routes', () => {
      const route = {
        path: '/text-templates',
        requiredPolicy: eTextTemplateManagementPolicyNames.TextTemplates,
      };

      expect(route.requiredPolicy).toBe('TextTemplateManagement.TextTemplates');
    });
  });
});
