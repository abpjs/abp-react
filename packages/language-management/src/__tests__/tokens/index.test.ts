/**
 * Tests for Language Management Tokens barrel export
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as tokens from '../../tokens';

describe('tokens barrel export', () => {
  describe('default constants exports', () => {
    it('should export DEFAULT_LANGUAGES_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_LANGUAGES_ENTITY_ACTIONS).toBeDefined();
      expect(Array.isArray(tokens.DEFAULT_LANGUAGES_ENTITY_ACTIONS)).toBe(true);
    });

    it('should export DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS).toBeDefined();
      expect(Array.isArray(tokens.DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS)).toBe(true);
    });

    it('should export DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS', () => {
      expect(tokens.DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGES_TOOLBAR_ACTIONS', () => {
      expect(tokens.DEFAULT_LANGUAGES_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS', () => {
      expect(tokens.DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGES_ENTITY_PROPS', () => {
      expect(tokens.DEFAULT_LANGUAGES_ENTITY_PROPS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS', () => {
      expect(tokens.DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGES_CREATE_FORM_PROPS', () => {
      expect(tokens.DEFAULT_LANGUAGES_CREATE_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGES_EDIT_FORM_PROPS', () => {
      expect(tokens.DEFAULT_LANGUAGES_EDIT_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS', () => {
      expect(tokens.DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS).toBeDefined();
    });

    it('should export DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS', () => {
      expect(tokens.DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS).toBeDefined();
    });
  });

  describe('token symbol exports', () => {
    it('should export LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS', () => {
      expect(tokens.LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
    });

    it('should export LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS', () => {
      expect(tokens.LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
    });

    it('should export LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS', () => {
      expect(tokens.LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
    });

    it('should export LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS', () => {
      expect(tokens.LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    });

    it('should export LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS', () => {
      expect(tokens.LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof tokens.LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    });
  });
});
