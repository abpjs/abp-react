import { describe, it, expect } from 'vitest';
import * as tokensExports from '../../tokens';

describe('tokens barrel exports (v3.0.0)', () => {
  describe('options.token exports', () => {
    it('should export ACCOUNT_OPTIONS', () => {
      expect(tokensExports.ACCOUNT_OPTIONS).toBeDefined();
      expect(typeof tokensExports.ACCOUNT_OPTIONS).toBe('symbol');
    });

    it('should export DEFAULT_ACCOUNT_OPTIONS', () => {
      expect(tokensExports.DEFAULT_ACCOUNT_OPTIONS).toBeDefined();
      expect(typeof tokensExports.DEFAULT_ACCOUNT_OPTIONS).toBe('object');
    });

    it('should export DEFAULT_ACCOUNT_OPTIONS with correct values', () => {
      expect(tokensExports.DEFAULT_ACCOUNT_OPTIONS.redirectUrl).toBe('/');
    });
  });

  describe('exports completeness', () => {
    it('should export all expected token items', () => {
      const exportKeys = Object.keys(tokensExports);
      expect(exportKeys).toContain('ACCOUNT_OPTIONS');
      expect(exportKeys).toContain('DEFAULT_ACCOUNT_OPTIONS');
    });

    it('should have at least 2 exports', () => {
      const exportKeys = Object.keys(tokensExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(2);
    });
  });
});
