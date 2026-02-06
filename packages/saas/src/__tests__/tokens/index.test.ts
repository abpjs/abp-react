/**
 * Tests for SaaS Tokens barrel export
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as tokens from '../../tokens';

describe('tokens barrel export', () => {
  describe('Entity Actions exports', () => {
    it('should export DEFAULT_EDITIONS_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_EDITIONS_ENTITY_ACTIONS).toBeDefined();
      expect(Array.isArray(tokens.DEFAULT_EDITIONS_ENTITY_ACTIONS)).toBe(true);
    });

    it('should export DEFAULT_TENANTS_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_TENANTS_ENTITY_ACTIONS).toBeDefined();
      expect(Array.isArray(tokens.DEFAULT_TENANTS_ENTITY_ACTIONS)).toBe(true);
    });

    it('should export DEFAULT_SAAS_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_SAAS_ENTITY_ACTIONS).toBeDefined();
      expect(typeof tokens.DEFAULT_SAAS_ENTITY_ACTIONS).toBe('object');
    });
  });

  describe('Toolbar Actions exports', () => {
    it('should export DEFAULT_EDITIONS_TOOLBAR_ACTIONS', () => {
      expect(tokens.DEFAULT_EDITIONS_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_TENANTS_TOOLBAR_ACTIONS', () => {
      expect(tokens.DEFAULT_TENANTS_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_TOOLBAR_ACTIONS', () => {
      expect(tokens.DEFAULT_SAAS_TOOLBAR_ACTIONS).toBeDefined();
    });
  });

  describe('Entity Props exports', () => {
    it('should export DEFAULT_EDITIONS_ENTITY_PROPS', () => {
      expect(tokens.DEFAULT_EDITIONS_ENTITY_PROPS).toBeDefined();
    });

    it('should export DEFAULT_TENANTS_ENTITY_PROPS', () => {
      expect(tokens.DEFAULT_TENANTS_ENTITY_PROPS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_ENTITY_PROPS', () => {
      expect(tokens.DEFAULT_SAAS_ENTITY_PROPS).toBeDefined();
    });
  });

  describe('Form Props exports', () => {
    it('should export DEFAULT_EDITIONS_CREATE_FORM_PROPS', () => {
      expect(tokens.DEFAULT_EDITIONS_CREATE_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_TENANTS_CREATE_FORM_PROPS', () => {
      expect(tokens.DEFAULT_TENANTS_CREATE_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_CREATE_FORM_PROPS', () => {
      expect(tokens.DEFAULT_SAAS_CREATE_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_EDITIONS_EDIT_FORM_PROPS', () => {
      expect(tokens.DEFAULT_EDITIONS_EDIT_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_TENANTS_EDIT_FORM_PROPS', () => {
      expect(tokens.DEFAULT_TENANTS_EDIT_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_SAAS_EDIT_FORM_PROPS', () => {
      expect(tokens.DEFAULT_SAAS_EDIT_FORM_PROPS).toBeDefined();
    });
  });

  describe('Contributor Symbols exports', () => {
    it('should export SAAS_ENTITY_ACTION_CONTRIBUTORS', () => {
      expect(tokens.SAAS_ENTITY_ACTION_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.SAAS_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
    });

    it('should export SAAS_TOOLBAR_ACTION_CONTRIBUTORS', () => {
      expect(tokens.SAAS_TOOLBAR_ACTION_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.SAAS_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
    });

    it('should export SAAS_ENTITY_PROP_CONTRIBUTORS', () => {
      expect(tokens.SAAS_ENTITY_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.SAAS_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
    });

    it('should export SAAS_CREATE_FORM_PROP_CONTRIBUTORS', () => {
      expect(tokens.SAAS_CREATE_FORM_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.SAAS_CREATE_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    });

    it('should export SAAS_EDIT_FORM_PROP_CONTRIBUTORS', () => {
      expect(tokens.SAAS_EDIT_FORM_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.SAAS_EDIT_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    });
  });
});
