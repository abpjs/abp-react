/**
 * Tests for guards barrel export
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as guards from '../../guards';

describe('Guards Barrel Export', () => {
  describe('Extension Guard Function Export', () => {
    it('should export textTemplateManagementExtensionsGuard', () => {
      expect(guards.textTemplateManagementExtensionsGuard).toBeDefined();
      expect(typeof guards.textTemplateManagementExtensionsGuard).toBe(
        'function',
      );
    });
  });

  describe('Extension Guard Hook Export', () => {
    it('should export useTextTemplateManagementExtensionsGuard', () => {
      expect(guards.useTextTemplateManagementExtensionsGuard).toBeDefined();
      expect(typeof guards.useTextTemplateManagementExtensionsGuard).toBe(
        'function',
      );
    });
  });

  describe('Extension Guard Class Export', () => {
    it('should export TextTemplateManagementExtensionsGuard', () => {
      expect(guards.TextTemplateManagementExtensionsGuard).toBeDefined();
    });

    it('should be instantiable', () => {
      const instance = new guards.TextTemplateManagementExtensionsGuard();
      expect(instance).toBeInstanceOf(
        guards.TextTemplateManagementExtensionsGuard,
      );
    });
  });

  describe('All Expected Exports', () => {
    it('should have all guard exports', () => {
      const exportKeys = Object.keys(guards);
      expect(exportKeys).toContain('textTemplateManagementExtensionsGuard');
      expect(exportKeys).toContain('useTextTemplateManagementExtensionsGuard');
      expect(exportKeys).toContain('TextTemplateManagementExtensionsGuard');
    });
  });
});
