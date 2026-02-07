/**
 * Tests for IdentityClaimValueType enum
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect } from 'vitest';
import {
  IdentityClaimValueType,
  identityClaimValueTypeOptions,
} from '../../../proxy/identity/identity-claim-value-type.enum';

describe('IdentityClaimValueType', () => {
  describe('enum values', () => {
    it('should have String = 0', () => {
      expect(IdentityClaimValueType.String).toBe(0);
    });

    it('should have Int = 1', () => {
      expect(IdentityClaimValueType.Int).toBe(1);
    });

    it('should have Boolean = 2', () => {
      expect(IdentityClaimValueType.Boolean).toBe(2);
    });

    it('should have DateTime = 3', () => {
      expect(IdentityClaimValueType.DateTime).toBe(3);
    });

    it('should have exactly 4 values', () => {
      const values = Object.values(IdentityClaimValueType).filter(
        (v) => typeof v === 'number'
      );
      expect(values).toHaveLength(4);
    });

    it('should be a numeric enum with reverse mapping', () => {
      expect(IdentityClaimValueType[0]).toBe('String');
      expect(IdentityClaimValueType[1]).toBe('Int');
      expect(IdentityClaimValueType[2]).toBe('Boolean');
      expect(IdentityClaimValueType[3]).toBe('DateTime');
    });
  });

  describe('enum keys', () => {
    it('should have String key', () => {
      expect('String' in IdentityClaimValueType).toBe(true);
    });

    it('should have Int key', () => {
      expect('Int' in IdentityClaimValueType).toBe(true);
    });

    it('should have Boolean key', () => {
      expect('Boolean' in IdentityClaimValueType).toBe(true);
    });

    it('should have DateTime key', () => {
      expect('DateTime' in IdentityClaimValueType).toBe(true);
    });
  });
});

describe('identityClaimValueTypeOptions', () => {
  it('should be an array of 4 options', () => {
    expect(identityClaimValueTypeOptions).toHaveLength(4);
  });

  it('should have String as first option', () => {
    expect(identityClaimValueTypeOptions[0]).toEqual({
      label: 'String',
      value: IdentityClaimValueType.String,
    });
  });

  it('should have Int as second option', () => {
    expect(identityClaimValueTypeOptions[1]).toEqual({
      label: 'Int',
      value: IdentityClaimValueType.Int,
    });
  });

  it('should have Boolean as third option', () => {
    expect(identityClaimValueTypeOptions[2]).toEqual({
      label: 'Boolean',
      value: IdentityClaimValueType.Boolean,
    });
  });

  it('should have DateTime as fourth option', () => {
    expect(identityClaimValueTypeOptions[3]).toEqual({
      label: 'DateTime',
      value: IdentityClaimValueType.DateTime,
    });
  });

  it('should have all options with label and value properties', () => {
    identityClaimValueTypeOptions.forEach((option) => {
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('value');
      expect(typeof option.label).toBe('string');
      expect(typeof option.value).toBe('number');
    });
  });

  it('should have unique values for each option', () => {
    const values = identityClaimValueTypeOptions.map((o) => o.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should have unique labels for each option', () => {
    const labels = identityClaimValueTypeOptions.map((o) => o.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  it('should match enum keys to labels', () => {
    identityClaimValueTypeOptions.forEach((option) => {
      expect(option.label).toBe(IdentityClaimValueType[option.value]);
    });
  });
});

describe('enum usage patterns', () => {
  it('should work in switch statements', () => {
    const getTypeDescription = (type: IdentityClaimValueType): string => {
      switch (type) {
        case IdentityClaimValueType.String:
          return 'Text value';
        case IdentityClaimValueType.Int:
          return 'Integer value';
        case IdentityClaimValueType.Boolean:
          return 'True/False value';
        case IdentityClaimValueType.DateTime:
          return 'Date and time value';
        default:
          return 'Unknown';
      }
    };

    expect(getTypeDescription(IdentityClaimValueType.String)).toBe('Text value');
    expect(getTypeDescription(IdentityClaimValueType.Int)).toBe('Integer value');
    expect(getTypeDescription(IdentityClaimValueType.Boolean)).toBe('True/False value');
    expect(getTypeDescription(IdentityClaimValueType.DateTime)).toBe('Date and time value');
  });

  it('should work in comparisons', () => {
    const isTextType = (type: IdentityClaimValueType): boolean => {
      return type === IdentityClaimValueType.String;
    };

    expect(isTextType(IdentityClaimValueType.String)).toBe(true);
    expect(isTextType(IdentityClaimValueType.Int)).toBe(false);
    expect(isTextType(IdentityClaimValueType.Boolean)).toBe(false);
    expect(isTextType(IdentityClaimValueType.DateTime)).toBe(false);
  });

  it('should be usable as object keys', () => {
    const typeNames: Record<IdentityClaimValueType, string> = {
      [IdentityClaimValueType.String]: 'String',
      [IdentityClaimValueType.Int]: 'Int',
      [IdentityClaimValueType.Boolean]: 'Boolean',
      [IdentityClaimValueType.DateTime]: 'DateTime',
    };

    expect(typeNames[IdentityClaimValueType.String]).toBe('String');
    expect(typeNames[IdentityClaimValueType.Int]).toBe('Int');
    expect(typeNames[IdentityClaimValueType.Boolean]).toBe('Boolean');
    expect(typeNames[IdentityClaimValueType.DateTime]).toBe('DateTime');
  });

  it('should find option by value from options array', () => {
    const findOptionByValue = (value: IdentityClaimValueType) =>
      identityClaimValueTypeOptions.find((o) => o.value === value);

    expect(findOptionByValue(IdentityClaimValueType.String)?.label).toBe('String');
    expect(findOptionByValue(IdentityClaimValueType.Int)?.label).toBe('Int');
    expect(findOptionByValue(IdentityClaimValueType.Boolean)?.label).toBe('Boolean');
    expect(findOptionByValue(IdentityClaimValueType.DateTime)?.label).toBe('DateTime');
  });

  it('should validate claim value based on type', () => {
    const validateClaimValue = (
      type: IdentityClaimValueType,
      value: string
    ): boolean => {
      switch (type) {
        case IdentityClaimValueType.String:
          return typeof value === 'string';
        case IdentityClaimValueType.Int:
          return !isNaN(parseInt(value, 10));
        case IdentityClaimValueType.Boolean:
          return value === 'true' || value === 'false';
        case IdentityClaimValueType.DateTime:
          return !isNaN(Date.parse(value));
        default:
          return false;
      }
    };

    expect(validateClaimValue(IdentityClaimValueType.String, 'hello')).toBe(true);
    expect(validateClaimValue(IdentityClaimValueType.Int, '42')).toBe(true);
    expect(validateClaimValue(IdentityClaimValueType.Int, 'abc')).toBe(false);
    expect(validateClaimValue(IdentityClaimValueType.Boolean, 'true')).toBe(true);
    expect(validateClaimValue(IdentityClaimValueType.Boolean, 'yes')).toBe(false);
    expect(validateClaimValue(IdentityClaimValueType.DateTime, '2024-01-01')).toBe(true);
    expect(validateClaimValue(IdentityClaimValueType.DateTime, 'not-a-date')).toBe(false);
  });
});
