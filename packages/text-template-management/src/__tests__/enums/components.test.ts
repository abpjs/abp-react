/**
 * Tests for eTextTemplateManagementComponents
 * @since 2.7.0
 */
import { describe, it, expect } from 'vitest';
import {
  eTextTemplateManagementComponents,
  type TextTemplateManagementComponentKey,
} from '../../enums/components';

describe('eTextTemplateManagementComponents', () => {
  describe('Const Object Values', () => {
    it('should have TextTemplates key with correct value', () => {
      expect(eTextTemplateManagementComponents.TextTemplates).toBe(
        'TextTemplateManagement.TextTemplates'
      );
    });

    it('should have TemplateContents key with correct value', () => {
      expect(eTextTemplateManagementComponents.TemplateContents).toBe(
        'TextTemplateManagement.TemplateContents'
      );
    });

    it('should have InlineTemplateContent key with correct value', () => {
      expect(eTextTemplateManagementComponents.InlineTemplateContent).toBe(
        'TextTemplateManagement.InlineTemplateContent'
      );
    });
  });

  describe('String Values Usage', () => {
    it('should allow string comparison for TextTemplates', () => {
      const value = eTextTemplateManagementComponents.TextTemplates;
      expect(value).toEqual('TextTemplateManagement.TextTemplates');
    });

    it('should allow string comparison for TemplateContents', () => {
      const value = eTextTemplateManagementComponents.TemplateContents;
      expect(value).toEqual('TextTemplateManagement.TemplateContents');
    });

    it('should allow string comparison for InlineTemplateContent', () => {
      const value = eTextTemplateManagementComponents.InlineTemplateContent;
      expect(value).toEqual('TextTemplateManagement.InlineTemplateContent');
    });
  });

  describe('Object Structure', () => {
    it('should be a frozen object (as const)', () => {
      const keys = Object.keys(eTextTemplateManagementComponents);
      expect(keys).toContain('TextTemplates');
      expect(keys).toContain('TemplateContents');
      expect(keys).toContain('InlineTemplateContent');
      expect(keys).toHaveLength(3);
    });

    it('should have all values as strings', () => {
      Object.values(eTextTemplateManagementComponents).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should follow Module.ComponentName pattern', () => {
      Object.values(eTextTemplateManagementComponents).forEach((value) => {
        expect(value).toMatch(/^TextTemplateManagement\.\w+$/);
      });
    });
  });

  describe('TextTemplateManagementComponentKey Type', () => {
    it('should accept TextTemplates value', () => {
      const key: TextTemplateManagementComponentKey =
        eTextTemplateManagementComponents.TextTemplates;
      expect(key).toBe('TextTemplateManagement.TextTemplates');
    });

    it('should accept TemplateContents value', () => {
      const key: TextTemplateManagementComponentKey =
        eTextTemplateManagementComponents.TemplateContents;
      expect(key).toBe('TextTemplateManagement.TemplateContents');
    });

    it('should accept InlineTemplateContent value', () => {
      const key: TextTemplateManagementComponentKey =
        eTextTemplateManagementComponents.InlineTemplateContent;
      expect(key).toBe('TextTemplateManagement.InlineTemplateContent');
    });
  });

  describe('Type-Safe Lookup', () => {
    it('should allow type-safe component lookup', () => {
      const components: Record<TextTemplateManagementComponentKey, string> = {
        'TextTemplateManagement.TextTemplates': 'TextTemplates Component',
        'TextTemplateManagement.TemplateContents': 'TemplateContents Component',
        'TextTemplateManagement.InlineTemplateContent': 'InlineTemplateContent Component',
      };

      expect(components[eTextTemplateManagementComponents.TextTemplates]).toBe(
        'TextTemplates Component'
      );
      expect(components[eTextTemplateManagementComponents.TemplateContents]).toBe(
        'TemplateContents Component'
      );
      expect(components[eTextTemplateManagementComponents.InlineTemplateContent]).toBe(
        'InlineTemplateContent Component'
      );
    });
  });
});
