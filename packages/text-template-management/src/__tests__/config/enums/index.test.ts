/**
 * Tests for config/enums barrel export
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configEnums from '../../../config/enums';

describe('Config Enums Barrel Export', () => {
  describe('Policy Names Export', () => {
    it('should export eTextTemplateManagementPolicyNames', () => {
      expect(configEnums.eTextTemplateManagementPolicyNames).toBeDefined();
    });

    it('should have TextTemplates policy', () => {
      expect(
        configEnums.eTextTemplateManagementPolicyNames.TextTemplates,
      ).toBe('TextTemplateManagement.TextTemplates');
    });
  });

  describe('Route Names Export', () => {
    it('should export eTextTemplateManagementRouteNames', () => {
      expect(configEnums.eTextTemplateManagementRouteNames).toBeDefined();
    });

    it('should have TextTemplates route name', () => {
      expect(configEnums.eTextTemplateManagementRouteNames.TextTemplates).toBe(
        'TextTemplateManagement::Menu:TextTemplates',
      );
    });
  });

  describe('All Expected Exports', () => {
    it('should export all expected constants', () => {
      const exportKeys = Object.keys(configEnums);
      expect(exportKeys).toContain('eTextTemplateManagementPolicyNames');
      expect(exportKeys).toContain('eTextTemplateManagementRouteNames');
    });
  });
});
