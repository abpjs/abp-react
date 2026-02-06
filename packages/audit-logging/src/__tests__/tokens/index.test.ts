/**
 * Tests for tokens/index exports
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as Tokens from '../../tokens';

describe('tokens exports (v3.0.0)', () => {
  describe('entity-details.token exports', () => {
    it('should export SHOW_ENTITY_DETAILS', () => {
      expect(Tokens.SHOW_ENTITY_DETAILS).toBeDefined();
      expect(typeof Tokens.SHOW_ENTITY_DETAILS).toBe('symbol');
    });

    it('should export SHOW_ENTITY_HISTORY', () => {
      expect(Tokens.SHOW_ENTITY_HISTORY).toBeDefined();
      expect(typeof Tokens.SHOW_ENTITY_HISTORY).toBe('symbol');
    });
  });

  describe('extensions.token exports', () => {
    it('should export DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS', () => {
      expect(Tokens.DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS', () => {
      expect(Tokens.DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS).toBeDefined();
    });

    it('should export DEFAULT_AUDIT_LOGGING_ENTITY_PROPS', () => {
      expect(Tokens.DEFAULT_AUDIT_LOGGING_ENTITY_PROPS).toBeDefined();
    });

    it('should export AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS', () => {
      expect(Tokens.AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS).toBeDefined();
      expect(typeof Tokens.AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
    });

    it('should export AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS', () => {
      expect(Tokens.AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS).toBeDefined();
      expect(typeof Tokens.AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
    });

    it('should export AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS', () => {
      expect(Tokens.AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS).toBeDefined();
      expect(typeof Tokens.AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
    });
  });
});
