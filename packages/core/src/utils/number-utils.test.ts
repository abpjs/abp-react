import { describe, it, expect } from 'vitest';
import { isNumber } from './number-utils';

describe('number-utils (v2.7.0)', () => {
  describe('isNumber', () => {
    describe('with number type', () => {
      it('should return true for positive integers', () => {
        expect(isNumber(42)).toBe(true);
        expect(isNumber(1)).toBe(true);
        expect(isNumber(100000)).toBe(true);
      });

      it('should return true for negative integers', () => {
        expect(isNumber(-42)).toBe(true);
        expect(isNumber(-1)).toBe(true);
      });

      it('should return true for zero', () => {
        expect(isNumber(0)).toBe(true);
      });

      it('should return true for floating point numbers', () => {
        expect(isNumber(3.14)).toBe(true);
        expect(isNumber(0.001)).toBe(true);
        expect(isNumber(-2.5)).toBe(true);
      });

      it('should return false for NaN', () => {
        expect(isNumber(NaN)).toBe(false);
      });

      it('should return false for Infinity', () => {
        expect(isNumber(Infinity)).toBe(false);
        expect(isNumber(-Infinity)).toBe(false);
      });
    });

    describe('with string type', () => {
      it('should return true for numeric strings', () => {
        expect(isNumber('42')).toBe(true);
        expect(isNumber('3.14')).toBe(true);
        expect(isNumber('-100')).toBe(true);
        expect(isNumber('0')).toBe(true);
      });

      it('should return true for strings with leading zeros', () => {
        expect(isNumber('007')).toBe(true);
        expect(isNumber('0123')).toBe(true);
      });

      it('should return true for exponential notation strings', () => {
        expect(isNumber('1e5')).toBe(true);
        expect(isNumber('2.5e-3')).toBe(true);
      });

      it('should return false for empty string', () => {
        expect(isNumber('')).toBe(false);
      });

      it('should return false for whitespace-only strings', () => {
        expect(isNumber('   ')).toBe(false);
        expect(isNumber('\t')).toBe(false);
        expect(isNumber('\n')).toBe(false);
      });

      it('should return false for non-numeric strings', () => {
        expect(isNumber('abc')).toBe(false);
        expect(isNumber('hello')).toBe(false);
        expect(isNumber('NaN')).toBe(false);
      });

      it('should return false for mixed content strings', () => {
        expect(isNumber('12abc')).toBe(false);
        expect(isNumber('abc12')).toBe(false);
        expect(isNumber('12.34.56')).toBe(false);
      });

      it('should return true for strings with surrounding whitespace', () => {
        // Number() trims whitespace
        expect(isNumber(' 42 ')).toBe(true);
        expect(isNumber('\t3.14\n')).toBe(true);
      });

      it('should return false for special string values', () => {
        expect(isNumber('undefined')).toBe(false);
        expect(isNumber('null')).toBe(false);
        expect(isNumber('Infinity')).toBe(false);
        expect(isNumber('-Infinity')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle very large numbers', () => {
        expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(isNumber(Number.MAX_VALUE)).toBe(true);
        expect(isNumber('9999999999999999999')).toBe(true);
      });

      it('should handle very small numbers', () => {
        expect(isNumber(Number.MIN_VALUE)).toBe(true);
        expect(isNumber('0.0000000001')).toBe(true);
      });

      it('should handle negative zero', () => {
        expect(isNumber(-0)).toBe(true);
        expect(isNumber('-0')).toBe(true);
      });
    });
  });
});
