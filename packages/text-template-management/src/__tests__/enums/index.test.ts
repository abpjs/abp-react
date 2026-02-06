/**
 * Tests for enums barrel export
 * @since 2.7.0
 */
import { describe, it, expect } from 'vitest';
import * as enums from '../../enums';

describe('Enums Barrel Export', () => {
  describe('eTextTemplateManagementComponents Export', () => {
    it('should export eTextTemplateManagementComponents', () => {
      expect(enums.eTextTemplateManagementComponents).toBeDefined();
    });

    it('should have all expected keys', () => {
      expect(enums.eTextTemplateManagementComponents.TextTemplates).toBeDefined();
      expect(enums.eTextTemplateManagementComponents.TemplateContents).toBeDefined();
      expect(enums.eTextTemplateManagementComponents.InlineTemplateContent).toBeDefined();
    });
  });

  describe('eTextTemplateManagementRouteNames Export', () => {
    it('should export eTextTemplateManagementRouteNames', () => {
      expect(enums.eTextTemplateManagementRouteNames).toBeDefined();
    });

    it('should have all expected keys', () => {
      expect(enums.eTextTemplateManagementRouteNames.Administration).toBeDefined();
      expect(enums.eTextTemplateManagementRouteNames.TextTemplates).toBeDefined();
    });
  });

  describe('Named Imports', () => {
    it('should allow importing eTextTemplateManagementComponents directly', () => {
      const { eTextTemplateManagementComponents } = enums;
      expect(eTextTemplateManagementComponents.TextTemplates).toBe(
        'TextTemplateManagement.TextTemplates'
      );
    });

    it('should allow importing eTextTemplateManagementRouteNames directly', () => {
      const { eTextTemplateManagementRouteNames } = enums;
      expect(eTextTemplateManagementRouteNames.TextTemplates).toBe(
        'TextTemplateManagement::Menu:TextTemplates'
      );
    });
  });
});
