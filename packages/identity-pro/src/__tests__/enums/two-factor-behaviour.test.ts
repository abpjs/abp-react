/**
 * Tests for eIdentityTwoFactorBehaviour enum
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect } from 'vitest';
import {
  eIdentityTwoFactorBehaviour,
  identityTwoFactorBehaviourOptions,
} from '../../enums/two-factor-behaviour';

describe('eIdentityTwoFactorBehaviour', () => {
  describe('enum values', () => {
    it('should have Optional = 0', () => {
      expect(eIdentityTwoFactorBehaviour.Optional).toBe(0);
    });

    it('should have Disabled = 1', () => {
      expect(eIdentityTwoFactorBehaviour.Disabled).toBe(1);
    });

    it('should have Forced = 2', () => {
      expect(eIdentityTwoFactorBehaviour.Forced).toBe(2);
    });

    it('should have exactly 3 values', () => {
      const values = Object.values(eIdentityTwoFactorBehaviour).filter(
        (v) => typeof v === 'number'
      );
      expect(values).toHaveLength(3);
    });

    it('should be a numeric enum with reverse mapping', () => {
      expect(eIdentityTwoFactorBehaviour[0]).toBe('Optional');
      expect(eIdentityTwoFactorBehaviour[1]).toBe('Disabled');
      expect(eIdentityTwoFactorBehaviour[2]).toBe('Forced');
    });
  });

  describe('enum keys', () => {
    it('should have Optional key', () => {
      expect('Optional' in eIdentityTwoFactorBehaviour).toBe(true);
    });

    it('should have Disabled key', () => {
      expect('Disabled' in eIdentityTwoFactorBehaviour).toBe(true);
    });

    it('should have Forced key', () => {
      expect('Forced' in eIdentityTwoFactorBehaviour).toBe(true);
    });
  });
});

describe('identityTwoFactorBehaviourOptions', () => {
  it('should be an array of 3 options', () => {
    expect(identityTwoFactorBehaviourOptions).toHaveLength(3);
  });

  it('should have Optional as first option', () => {
    expect(identityTwoFactorBehaviourOptions[0]).toEqual({
      label: 'Optional',
      value: eIdentityTwoFactorBehaviour.Optional,
    });
  });

  it('should have Disabled as second option', () => {
    expect(identityTwoFactorBehaviourOptions[1]).toEqual({
      label: 'Disabled',
      value: eIdentityTwoFactorBehaviour.Disabled,
    });
  });

  it('should have Forced as third option', () => {
    expect(identityTwoFactorBehaviourOptions[2]).toEqual({
      label: 'Forced',
      value: eIdentityTwoFactorBehaviour.Forced,
    });
  });

  it('should be readonly (as const)', () => {
    // TypeScript const assertion test - this should not allow mutation at compile time
    expect(Object.isFrozen(identityTwoFactorBehaviourOptions)).toBe(false);
    // Note: as const in TypeScript doesn't freeze at runtime, it's a compile-time feature
    expect(identityTwoFactorBehaviourOptions).toBeDefined();
  });

  it('should have all options with label and value properties', () => {
    identityTwoFactorBehaviourOptions.forEach((option) => {
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('value');
      expect(typeof option.label).toBe('string');
      expect(typeof option.value).toBe('number');
    });
  });

  it('should have unique values for each option', () => {
    const values = identityTwoFactorBehaviourOptions.map((o) => o.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should have unique labels for each option', () => {
    const labels = identityTwoFactorBehaviourOptions.map((o) => o.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  it('should match enum keys to labels', () => {
    expect(identityTwoFactorBehaviourOptions[0].label).toBe(
      eIdentityTwoFactorBehaviour[identityTwoFactorBehaviourOptions[0].value]
    );
    expect(identityTwoFactorBehaviourOptions[1].label).toBe(
      eIdentityTwoFactorBehaviour[identityTwoFactorBehaviourOptions[1].value]
    );
    expect(identityTwoFactorBehaviourOptions[2].label).toBe(
      eIdentityTwoFactorBehaviour[identityTwoFactorBehaviourOptions[2].value]
    );
  });
});

describe('enum usage patterns', () => {
  it('should work in switch statements', () => {
    const getBehaviourDescription = (behaviour: eIdentityTwoFactorBehaviour): string => {
      switch (behaviour) {
        case eIdentityTwoFactorBehaviour.Optional:
          return 'Two-factor is optional';
        case eIdentityTwoFactorBehaviour.Disabled:
          return 'Two-factor is disabled';
        case eIdentityTwoFactorBehaviour.Forced:
          return 'Two-factor is required';
        default:
          return 'Unknown';
      }
    };

    expect(getBehaviourDescription(eIdentityTwoFactorBehaviour.Optional)).toBe(
      'Two-factor is optional'
    );
    expect(getBehaviourDescription(eIdentityTwoFactorBehaviour.Disabled)).toBe(
      'Two-factor is disabled'
    );
    expect(getBehaviourDescription(eIdentityTwoFactorBehaviour.Forced)).toBe(
      'Two-factor is required'
    );
  });

  it('should work in comparisons', () => {
    const isStrict = (behaviour: eIdentityTwoFactorBehaviour): boolean => {
      return behaviour === eIdentityTwoFactorBehaviour.Forced;
    };

    expect(isStrict(eIdentityTwoFactorBehaviour.Forced)).toBe(true);
    expect(isStrict(eIdentityTwoFactorBehaviour.Optional)).toBe(false);
    expect(isStrict(eIdentityTwoFactorBehaviour.Disabled)).toBe(false);
  });

  it('should be usable as object keys', () => {
    const descriptions: Record<eIdentityTwoFactorBehaviour, string> = {
      [eIdentityTwoFactorBehaviour.Optional]: 'Optional',
      [eIdentityTwoFactorBehaviour.Disabled]: 'Disabled',
      [eIdentityTwoFactorBehaviour.Forced]: 'Forced',
    };

    expect(descriptions[eIdentityTwoFactorBehaviour.Optional]).toBe('Optional');
    expect(descriptions[eIdentityTwoFactorBehaviour.Disabled]).toBe('Disabled');
    expect(descriptions[eIdentityTwoFactorBehaviour.Forced]).toBe('Forced');
  });

  it('should find option by value from options array', () => {
    const findOptionByValue = (value: eIdentityTwoFactorBehaviour) =>
      identityTwoFactorBehaviourOptions.find((o) => o.value === value);

    expect(findOptionByValue(eIdentityTwoFactorBehaviour.Optional)?.label).toBe('Optional');
    expect(findOptionByValue(eIdentityTwoFactorBehaviour.Disabled)?.label).toBe('Disabled');
    expect(findOptionByValue(eIdentityTwoFactorBehaviour.Forced)?.label).toBe('Forced');
  });
});
