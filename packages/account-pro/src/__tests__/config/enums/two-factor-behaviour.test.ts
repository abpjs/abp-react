import { describe, it, expect } from 'vitest';
import { eTwoFactorBehaviour } from '../../../config/enums/two-factor-behaviour';

describe('eTwoFactorBehaviour (v3.2.0)', () => {
  describe('enum values', () => {
    it('should have Optional value equal to 0', () => {
      expect(eTwoFactorBehaviour.Optional).toBe(0);
    });

    it('should have Disabled value equal to 1', () => {
      expect(eTwoFactorBehaviour.Disabled).toBe(1);
    });

    it('should have Forced value equal to 2', () => {
      expect(eTwoFactorBehaviour.Forced).toBe(2);
    });
  });

  describe('enum structure', () => {
    it('should be a valid TypeScript enum', () => {
      expect(typeof eTwoFactorBehaviour).toBe('object');
      expect(eTwoFactorBehaviour).not.toBeNull();
    });

    it('should have exactly 3 named values', () => {
      // TypeScript enums with numeric values have both forward and reverse mappings
      const namedKeys = Object.keys(eTwoFactorBehaviour).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toHaveLength(3);
    });

    it('should contain all expected keys', () => {
      const namedKeys = Object.keys(eTwoFactorBehaviour).filter(
        (key) => isNaN(Number(key))
      );
      expect(namedKeys).toContain('Optional');
      expect(namedKeys).toContain('Disabled');
      expect(namedKeys).toContain('Forced');
    });

    it('should have numeric values', () => {
      expect(typeof eTwoFactorBehaviour.Optional).toBe('number');
      expect(typeof eTwoFactorBehaviour.Disabled).toBe('number');
      expect(typeof eTwoFactorBehaviour.Forced).toBe('number');
    });

    it('should support reverse lookup by value', () => {
      expect(eTwoFactorBehaviour[0]).toBe('Optional');
      expect(eTwoFactorBehaviour[1]).toBe('Disabled');
      expect(eTwoFactorBehaviour[2]).toBe('Forced');
    });
  });

  describe('type safety', () => {
    it('should work with eTwoFactorBehaviour type', () => {
      const optional: eTwoFactorBehaviour = eTwoFactorBehaviour.Optional;
      const disabled: eTwoFactorBehaviour = eTwoFactorBehaviour.Disabled;
      const forced: eTwoFactorBehaviour = eTwoFactorBehaviour.Forced;

      expect(optional).toBe(0);
      expect(disabled).toBe(1);
      expect(forced).toBe(2);
    });

    it('should allow assignment from numeric literals', () => {
      const behaviour: eTwoFactorBehaviour = 2;
      expect(behaviour).toBe(eTwoFactorBehaviour.Forced);
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const getBehaviourDescription = (
        behaviour: eTwoFactorBehaviour
      ): string => {
        switch (behaviour) {
          case eTwoFactorBehaviour.Optional:
            return 'Users can choose to enable 2FA';
          case eTwoFactorBehaviour.Disabled:
            return '2FA is disabled system-wide';
          case eTwoFactorBehaviour.Forced:
            return 'All users must use 2FA';
          default:
            return 'Unknown behaviour';
        }
      };

      expect(getBehaviourDescription(eTwoFactorBehaviour.Optional)).toBe(
        'Users can choose to enable 2FA'
      );
      expect(getBehaviourDescription(eTwoFactorBehaviour.Disabled)).toBe(
        '2FA is disabled system-wide'
      );
      expect(getBehaviourDescription(eTwoFactorBehaviour.Forced)).toBe(
        'All users must use 2FA'
      );
    });

    it('should work in conditional comparisons', () => {
      const is2FARequired = (behaviour: eTwoFactorBehaviour): boolean => {
        return behaviour === eTwoFactorBehaviour.Forced;
      };

      const is2FAAvailable = (behaviour: eTwoFactorBehaviour): boolean => {
        return behaviour !== eTwoFactorBehaviour.Disabled;
      };

      expect(is2FARequired(eTwoFactorBehaviour.Optional)).toBe(false);
      expect(is2FARequired(eTwoFactorBehaviour.Disabled)).toBe(false);
      expect(is2FARequired(eTwoFactorBehaviour.Forced)).toBe(true);

      expect(is2FAAvailable(eTwoFactorBehaviour.Optional)).toBe(true);
      expect(is2FAAvailable(eTwoFactorBehaviour.Disabled)).toBe(false);
      expect(is2FAAvailable(eTwoFactorBehaviour.Forced)).toBe(true);
    });

    it('should work in object mapping', () => {
      const behaviourLabels: Record<eTwoFactorBehaviour, string> = {
        [eTwoFactorBehaviour.Optional]: 'Optional',
        [eTwoFactorBehaviour.Disabled]: 'Disabled',
        [eTwoFactorBehaviour.Forced]: 'Forced',
      };

      expect(behaviourLabels[eTwoFactorBehaviour.Optional]).toBe('Optional');
      expect(behaviourLabels[eTwoFactorBehaviour.Disabled]).toBe('Disabled');
      expect(behaviourLabels[eTwoFactorBehaviour.Forced]).toBe('Forced');
    });

    it('should work with array filtering', () => {
      const allowsUserChoice = [
        eTwoFactorBehaviour.Optional,
        eTwoFactorBehaviour.Forced,
      ];

      expect(allowsUserChoice.includes(eTwoFactorBehaviour.Optional)).toBe(
        true
      );
      expect(allowsUserChoice.includes(eTwoFactorBehaviour.Disabled)).toBe(
        false
      );
      expect(allowsUserChoice.includes(eTwoFactorBehaviour.Forced)).toBe(true);
    });
  });

  describe('value ordering', () => {
    it('should have values in ascending order', () => {
      expect(eTwoFactorBehaviour.Optional).toBeLessThan(
        eTwoFactorBehaviour.Disabled
      );
      expect(eTwoFactorBehaviour.Disabled).toBeLessThan(
        eTwoFactorBehaviour.Forced
      );
    });

    it('should have consecutive values starting from 0', () => {
      expect(eTwoFactorBehaviour.Optional).toBe(0);
      expect(eTwoFactorBehaviour.Disabled).toBe(1);
      expect(eTwoFactorBehaviour.Forced).toBe(2);
    });
  });

  describe('security policy scenarios', () => {
    it('should identify when 2FA can be toggled by user', () => {
      const canUserToggle2FA = (behaviour: eTwoFactorBehaviour): boolean => {
        return behaviour === eTwoFactorBehaviour.Optional;
      };

      expect(canUserToggle2FA(eTwoFactorBehaviour.Optional)).toBe(true);
      expect(canUserToggle2FA(eTwoFactorBehaviour.Disabled)).toBe(false);
      expect(canUserToggle2FA(eTwoFactorBehaviour.Forced)).toBe(false);
    });

    it('should identify enforcement levels', () => {
      const getEnforcementLevel = (
        behaviour: eTwoFactorBehaviour
      ): 'none' | 'optional' | 'required' => {
        switch (behaviour) {
          case eTwoFactorBehaviour.Disabled:
            return 'none';
          case eTwoFactorBehaviour.Optional:
            return 'optional';
          case eTwoFactorBehaviour.Forced:
            return 'required';
          default:
            return 'none';
        }
      };

      expect(getEnforcementLevel(eTwoFactorBehaviour.Optional)).toBe('optional');
      expect(getEnforcementLevel(eTwoFactorBehaviour.Disabled)).toBe('none');
      expect(getEnforcementLevel(eTwoFactorBehaviour.Forced)).toBe('required');
    });
  });
});
