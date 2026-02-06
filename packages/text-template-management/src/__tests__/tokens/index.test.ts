/**
 * Tests for tokens barrel export
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as tokens from '../../tokens';

describe('Tokens Barrel Export', () => {
  describe('Default Entity Actions Exports', () => {
    it('should export DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS', () => {
      expect(
        tokens.DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS,
      ).toBeDefined();
    });
  });

  describe('Default Toolbar Actions Exports', () => {
    it('should export DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS', () => {
      expect(tokens.DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS', () => {
      expect(
        tokens.DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS,
      ).toBeDefined();
    });
  });

  describe('Default Entity Props Exports', () => {
    it('should export DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS', () => {
      expect(tokens.DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS).toBeDefined();
    });

    it('should export DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS', () => {
      expect(
        tokens.DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS,
      ).toBeDefined();
    });
  });

  describe('Contributor Token Symbol Exports', () => {
    it('should export TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS', () => {
      expect(
        tokens.TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
      ).toBeDefined();
      expect(
        typeof tokens.TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
      ).toBe('symbol');
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS', () => {
      expect(
        tokens.TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
      ).toBeDefined();
      expect(
        typeof tokens.TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
      ).toBe('symbol');
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS', () => {
      expect(
        tokens.TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      ).toBeDefined();
      expect(
        typeof tokens.TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      ).toBe('symbol');
    });
  });

  describe('All Expected Exports', () => {
    it('should have all token exports', () => {
      const exportKeys = Object.keys(tokens);
      expect(exportKeys).toContain('DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS');
      expect(exportKeys).toContain(
        'DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS',
      );
      expect(exportKeys).toContain('DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS');
      expect(exportKeys).toContain(
        'DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS',
      );
      expect(exportKeys).toContain('DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS');
      expect(exportKeys).toContain(
        'DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS',
      );
      expect(exportKeys).toContain(
        'TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS',
      );
      expect(exportKeys).toContain(
        'TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS',
      );
      expect(exportKeys).toContain(
        'TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS',
      );
    });
  });
});
