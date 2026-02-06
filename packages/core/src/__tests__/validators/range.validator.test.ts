/**
 * Tests for Range Validator
 * @since 2.9.0
 */

import { describe, it, expect } from 'vitest';
import { validateRange, RangeError } from '../../validators/range.validator';

describe('validateRange', () => {
  describe('empty values', () => {
    it('should return null for null', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator('')).toBeNull();
    });
  });

  describe('valid ranges', () => {
    it('should accept value within range', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator(50)).toBeNull();
    });

    it('should accept value at minimum', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator(0)).toBeNull();
    });

    it('should accept value at maximum', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator(100)).toBeNull();
    });

    it('should accept negative values within range', () => {
      const validator = validateRange({ minimum: -50, maximum: 50 });
      expect(validator(-25)).toBeNull();
      expect(validator(0)).toBeNull();
      expect(validator(25)).toBeNull();
    });

    it('should accept decimal values', () => {
      const validator = validateRange({ minimum: 0, maximum: 1 });
      expect(validator(0.5)).toBeNull();
      expect(validator(0.99)).toBeNull();
    });
  });

  describe('invalid ranges', () => {
    it('should reject value below minimum', () => {
      const validator = validateRange({ minimum: 10, maximum: 100 });
      const result = validator(5) as RangeError;
      expect(result).not.toBeNull();
      expect(result.range.min).toBe(10);
      expect(result.range.max).toBe(100);
    });

    it('should reject value above maximum', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      const result = validator(150) as RangeError;
      expect(result).not.toBeNull();
      expect(result.range.min).toBe(0);
      expect(result.range.max).toBe(100);
    });

    it('should reject negative value when minimum is positive', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      const result = validator(-10) as RangeError;
      expect(result).not.toBeNull();
    });
  });

  describe('string input', () => {
    it('should parse numeric string', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator('50')).toBeNull();
    });

    it('should reject invalid numeric string below range', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      const result = validator('-10') as RangeError;
      expect(result).not.toBeNull();
    });

    it('should return null for non-numeric string', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator('abc')).toBeNull();
    });

    it('should handle string with decimal', () => {
      const validator = validateRange({ minimum: 0, maximum: 10 });
      expect(validator('5.5')).toBeNull();
    });
  });

  describe('default options', () => {
    it('should use MAX_SAFE_INTEGER and MIN_SAFE_INTEGER by default', () => {
      const validator = validateRange();
      expect(validator(Number.MAX_SAFE_INTEGER)).toBeNull();
      expect(validator(Number.MIN_SAFE_INTEGER)).toBeNull();
      expect(validator(0)).toBeNull();
    });
  });

  describe('only minimum specified', () => {
    it('should validate only minimum when maximum not specified', () => {
      const validator = validateRange({ minimum: 18 });
      expect(validator(18)).toBeNull();
      expect(validator(100)).toBeNull();
      expect(validator(Number.MAX_SAFE_INTEGER)).toBeNull();

      const result = validator(17) as RangeError;
      expect(result).not.toBeNull();
      expect(result.range.min).toBe(18);
    });
  });

  describe('only maximum specified', () => {
    it('should validate only maximum when minimum not specified', () => {
      const validator = validateRange({ maximum: 100 });
      expect(validator(100)).toBeNull();
      expect(validator(0)).toBeNull();
      expect(validator(-1000)).toBeNull();

      const result = validator(101) as RangeError;
      expect(result).not.toBeNull();
      expect(result.range.max).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle zero range (min equals max)', () => {
      const validator = validateRange({ minimum: 50, maximum: 50 });
      expect(validator(50)).toBeNull();

      const result = validator(51) as RangeError;
      expect(result).not.toBeNull();
    });

    it('should handle floating point precision', () => {
      const validator = validateRange({ minimum: 0.1, maximum: 0.3 });
      expect(validator(0.2)).toBeNull();
    });

    it('should handle NaN input', () => {
      const validator = validateRange({ minimum: 0, maximum: 100 });
      expect(validator(NaN)).toBeNull();
    });
  });
});
