/**
 * Tests for Age Validator
 * @since 2.9.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateMinAge, MinAgeError } from '../../validators/age.validator';

describe('validateMinAge', () => {
  beforeEach(() => {
    // Mock current date to 2024-06-15 for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('with default age (18)', () => {
    it('should return null for empty value', () => {
      const validator = validateMinAge();
      expect(validator('')).toBeNull();
      expect(validator(null)).toBeNull();
      expect(validator(undefined)).toBeNull();
    });

    it('should return null for invalid date', () => {
      const validator = validateMinAge();
      expect(validator('invalid-date')).toBeNull();
      expect(validator('not a date')).toBeNull();
    });

    it('should return null for age exactly 18', () => {
      const validator = validateMinAge();
      // Born on 2006-06-15, exactly 18 years old
      expect(validator('2006-06-15')).toBeNull();
    });

    it('should return null for age over 18', () => {
      const validator = validateMinAge();
      // Born in 2000, 24 years old
      expect(validator('2000-01-01')).toBeNull();
      expect(validator(new Date('2000-01-01'))).toBeNull();
    });

    it('should return error for age under 18', () => {
      const validator = validateMinAge();
      // Born in 2010, 14 years old
      const result = validator('2010-01-01') as MinAgeError;
      expect(result).not.toBeNull();
      expect(result.minAge.age).toBe(18);
    });

    it('should handle birthday not yet passed this year', () => {
      const validator = validateMinAge();
      // Born on 2006-12-15, still 17 (birthday in 6 months)
      const result = validator('2006-12-15') as MinAgeError;
      expect(result).not.toBeNull();
      expect(result.minAge.age).toBe(18);
    });

    it('should handle birthday already passed this year', () => {
      const validator = validateMinAge();
      // Born on 2006-01-15, already 18
      expect(validator('2006-01-15')).toBeNull();
    });
  });

  describe('with custom age', () => {
    it('should validate with custom minimum age of 21', () => {
      const validator = validateMinAge({ age: 21 });

      // 20 years old should fail
      const result = validator('2004-01-01') as MinAgeError;
      expect(result).not.toBeNull();
      expect(result.minAge.age).toBe(21);

      // 22 years old should pass
      expect(validator('2002-01-01')).toBeNull();
    });

    it('should validate with custom minimum age of 13', () => {
      const validator = validateMinAge({ age: 13 });

      // 12 years old should fail
      const result = validator('2012-01-01') as MinAgeError;
      expect(result).not.toBeNull();
      expect(result.minAge.age).toBe(13);

      // 14 years old should pass
      expect(validator('2010-01-01')).toBeNull();
    });

    it('should validate with age 0', () => {
      const validator = validateMinAge({ age: 0 });
      // Any valid date should pass
      expect(validator('2024-01-01')).toBeNull();
    });
  });

  describe('with Date objects', () => {
    it('should handle Date object input', () => {
      const validator = validateMinAge();

      // Over 18
      expect(validator(new Date('1990-01-01'))).toBeNull();

      // Under 18
      const result = validator(new Date('2020-01-01')) as MinAgeError;
      expect(result).not.toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle leap year birthdays', () => {
      const validator = validateMinAge();
      // Born on Feb 29, 2000 (leap year)
      expect(validator('2000-02-29')).toBeNull();
    });

    it('should handle same day, different month', () => {
      const validator = validateMinAge();
      // Born on same day (15th) but later month
      const result = validator('2006-07-15') as MinAgeError;
      expect(result).not.toBeNull();
    });

    it('should handle same month, earlier day', () => {
      const validator = validateMinAge();
      // Born on same month (June) but earlier day
      expect(validator('2006-06-01')).toBeNull();
    });
  });
});
