/**
 * Tests for Required Validator
 * @since 2.9.0
 */

import { describe, it, expect } from 'vitest';
import { validateRequired, RequiredError } from '../../validators/required.validator';

describe('validateRequired', () => {
  describe('with default options', () => {
    const validator = validateRequired();

    it('should return error for null', () => {
      const result = validator(null) as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should return error for undefined', () => {
      const result = validator(undefined) as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should return error for empty string', () => {
      const result = validator('') as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should return error for whitespace-only string', () => {
      const result = validator('   ') as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should return error for empty array', () => {
      const result = validator([]) as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should return null for non-empty string', () => {
      expect(validator('hello')).toBeNull();
    });

    it('should return null for string with spaces around text', () => {
      expect(validator('  hello  ')).toBeNull();
    });

    it('should return null for number', () => {
      expect(validator(42)).toBeNull();
    });

    it('should return null for zero', () => {
      expect(validator(0)).toBeNull();
    });

    it('should return null for false', () => {
      expect(validator(false)).toBeNull();
    });

    it('should return null for non-empty array', () => {
      expect(validator([1, 2, 3])).toBeNull();
    });

    it('should return null for object', () => {
      expect(validator({ key: 'value' })).toBeNull();
    });

    it('should return null for empty object', () => {
      expect(validator({})).toBeNull();
    });
  });

  describe('with allowEmptyStrings: true', () => {
    const validator = validateRequired({ allowEmptyStrings: true });

    it('should return null for empty string when allowEmptyStrings is true', () => {
      expect(validator('')).toBeNull();
    });

    it('should return null for whitespace string when allowEmptyStrings is true', () => {
      expect(validator('   ')).toBeNull();
    });

    it('should still return error for null', () => {
      const result = validator(null) as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should still return error for undefined', () => {
      const result = validator(undefined) as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should still return error for empty array', () => {
      const result = validator([]) as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return null for array with empty string', () => {
      const validator = validateRequired();
      expect(validator([''])).toBeNull();
    });

    it('should return null for array with null', () => {
      const validator = validateRequired();
      expect(validator([null])).toBeNull();
    });

    it('should return null for Date object', () => {
      const validator = validateRequired();
      expect(validator(new Date())).toBeNull();
    });

    it('should return null for function', () => {
      const validator = validateRequired();
      expect(validator(() => {})).toBeNull();
    });

    it('should return null for NaN', () => {
      const validator = validateRequired();
      expect(validator(NaN)).toBeNull();
    });

    it('should return null for Infinity', () => {
      const validator = validateRequired();
      expect(validator(Infinity)).toBeNull();
    });

    it('should return null for negative zero', () => {
      const validator = validateRequired();
      expect(validator(-0)).toBeNull();
    });

    it('should handle tab characters as whitespace', () => {
      const validator = validateRequired();
      const result = validator('\t\t') as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should handle newline characters as whitespace', () => {
      const validator = validateRequired();
      const result = validator('\n\n') as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });

    it('should handle mixed whitespace as empty', () => {
      const validator = validateRequired();
      const result = validator(' \t\n\r ') as RequiredError;
      expect(result).not.toBeNull();
      expect(result.required).toBe(true);
    });
  });
});
