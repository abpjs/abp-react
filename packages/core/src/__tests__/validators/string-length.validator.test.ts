/**
 * Tests for String Length Validator
 * @since 2.9.0
 */

import { describe, it, expect } from 'vitest';
import {
  validateStringLength,
  StringLengthError,
} from '../../validators/string-length.validator';

describe('validateStringLength', () => {
  describe('empty values', () => {
    it('should return null for null', () => {
      const validator = validateStringLength({ minimumLength: 1, maximumLength: 10 });
      expect(validator(null)).toBeNull();
    });

    it('should return null for undefined', () => {
      const validator = validateStringLength({ minimumLength: 1, maximumLength: 10 });
      expect(validator(undefined)).toBeNull();
    });
  });

  describe('with minimum and maximum length', () => {
    const validator = validateStringLength({ minimumLength: 3, maximumLength: 10 });

    it('should return null for valid length', () => {
      expect(validator('hello')).toBeNull();
    });

    it('should return null for length at minimum', () => {
      expect(validator('abc')).toBeNull();
    });

    it('should return null for length at maximum', () => {
      expect(validator('abcdefghij')).toBeNull();
    });

    it('should return error for length below minimum', () => {
      const result = validator('ab') as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.minlength).toBeDefined();
      expect(result.minlength?.requiredLength).toBe(3);
      expect(result.maxlength).toBeUndefined();
    });

    it('should return error for length above maximum', () => {
      const result = validator('abcdefghijk') as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.maxlength).toBeDefined();
      expect(result.maxlength?.requiredLength).toBe(10);
      expect(result.minlength).toBeUndefined();
    });

    it('should return both errors for empty string', () => {
      const result = validator('') as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.minlength).toBeDefined();
      expect(result.minlength?.requiredLength).toBe(3);
    });
  });

  describe('with only minimum length', () => {
    const validator = validateStringLength({ minimumLength: 5 });

    it('should return null for valid length', () => {
      expect(validator('hello')).toBeNull();
    });

    it('should return null for long string', () => {
      expect(validator('a'.repeat(1000))).toBeNull();
    });

    it('should return error for short string', () => {
      const result = validator('hi') as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.minlength?.requiredLength).toBe(5);
    });
  });

  describe('with only maximum length', () => {
    const validator = validateStringLength({ maximumLength: 10 });

    it('should return null for valid length', () => {
      expect(validator('hello')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(validator('')).toBeNull();
    });

    it('should return error for long string', () => {
      const result = validator('abcdefghijk') as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.maxlength?.requiredLength).toBe(10);
    });
  });

  describe('with no options', () => {
    const validator = validateStringLength();

    it('should return null for any string', () => {
      expect(validator('')).toBeNull();
      expect(validator('any string')).toBeNull();
      expect(validator('a'.repeat(10000))).toBeNull();
    });
  });

  describe('type coercion', () => {
    const validator = validateStringLength({ minimumLength: 2, maximumLength: 5 });

    it('should convert number to string', () => {
      expect(validator(123)).toBeNull(); // "123" length is 3
    });

    it('should handle large number', () => {
      const result = validator(123456) as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.maxlength?.requiredLength).toBe(5);
    });

    it('should handle single digit number', () => {
      const result = validator(1) as StringLengthError;
      expect(result).not.toBeNull();
      expect(result.minlength?.requiredLength).toBe(2);
    });

    it('should handle boolean', () => {
      expect(validator(true)).toBeNull(); // "true" length is 4
      const result = validator(false) as StringLengthError;
      expect(result).toBeNull(); // "false" length is 5
    });
  });

  describe('edge cases', () => {
    it('should handle minimum equals maximum', () => {
      const validator = validateStringLength({ minimumLength: 5, maximumLength: 5 });
      expect(validator('hello')).toBeNull();

      const shortResult = validator('hi') as StringLengthError;
      expect(shortResult.minlength).toBeDefined();

      const longResult = validator('hello!') as StringLengthError;
      expect(longResult.maxlength).toBeDefined();
    });

    it('should handle minimum of 0', () => {
      const validator = validateStringLength({ minimumLength: 0, maximumLength: 10 });
      expect(validator('')).toBeNull();
    });

    it('should handle unicode characters', () => {
      const validator = validateStringLength({ minimumLength: 2, maximumLength: 5 });
      expect(validator('你好')).toBeNull(); // 2 characters
      expect(validator('🎉🎊')).toBeNull(); // 2 emoji (4 UTF-16 code units, but 2 characters)
    });

    it('should count whitespace in length', () => {
      const validator = validateStringLength({ minimumLength: 5, maximumLength: 10 });
      expect(validator('  a  ')).toBeNull(); // 5 characters including spaces
    });

    it('should handle string with newlines', () => {
      const validator = validateStringLength({ minimumLength: 3, maximumLength: 10 });
      expect(validator('a\nb')).toBeNull(); // 3 characters
    });
  });
});
