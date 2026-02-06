import { describe, it, expect } from 'vitest';
import * as utilsExports from '../../utils';

describe('utils barrel exports (v3.0.0)', () => {
  describe('factory-utils exports', () => {
    it('should export accountOptionsFactory', () => {
      expect(utilsExports.accountOptionsFactory).toBeDefined();
      expect(typeof utilsExports.accountOptionsFactory).toBe('function');
    });
  });

  describe('exports completeness', () => {
    it('should export all expected utility functions', () => {
      const exportKeys = Object.keys(utilsExports);
      expect(exportKeys).toContain('accountOptionsFactory');
    });

    it('should have at least 1 export', () => {
      const exportKeys = Object.keys(utilsExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('accountOptionsFactory functionality', () => {
    it('should return correct default redirectUrl', () => {
      const result = utilsExports.accountOptionsFactory({});
      expect(result.redirectUrl).toBe('/');
    });

    it('should apply custom redirectUrl', () => {
      const result = utilsExports.accountOptionsFactory({
        redirectUrl: '/custom',
      });
      expect(result.redirectUrl).toBe('/custom');
    });
  });
});
