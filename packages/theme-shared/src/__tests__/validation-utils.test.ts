import { describe, it, expect, vi } from 'vitest';
import {
  getPasswordValidators,
  getPasswordSettings,
  getPasswordValidationRules,
  PASSWORD_SETTING_KEYS,
  type SettingsStore,
} from '../utils/validation-utils';

/**
 * Tests for validation-utils.ts - Password validation utilities
 * @since 2.7.0
 */

describe('validation-utils', () => {
  describe('PASSWORD_SETTING_KEYS', () => {
    it('should have correct ABP Identity password setting keys', () => {
      expect(PASSWORD_SETTING_KEYS.requiredLength).toBe('Abp.Identity.Password.RequiredLength');
      expect(PASSWORD_SETTING_KEYS.maxLength).toBe('Abp.Identity.Password.MaxLength');
      expect(PASSWORD_SETTING_KEYS.requireDigit).toBe('Abp.Identity.Password.RequireDigit');
      expect(PASSWORD_SETTING_KEYS.requireLowercase).toBe('Abp.Identity.Password.RequireLowercase');
      expect(PASSWORD_SETTING_KEYS.requireUppercase).toBe('Abp.Identity.Password.RequireUppercase');
      expect(PASSWORD_SETTING_KEYS.requireNonAlphanumeric).toBe('Abp.Identity.Password.RequireNonAlphanumeric');
      expect(PASSWORD_SETTING_KEYS.requiredUniqueChars).toBe('Abp.Identity.Password.RequiredUniqueChars');
    });
  });

  describe('getPasswordSettings', () => {
    it('should return undefined for all settings when store has no values', () => {
      const store: SettingsStore = {
        getSetting: vi.fn().mockReturnValue(undefined),
      };

      const settings = getPasswordSettings(store);

      expect(settings.requiredLength).toBeUndefined();
      expect(settings.maxLength).toBeUndefined();
      expect(settings.requireDigit).toBeUndefined();
      expect(settings.requireLowercase).toBeUndefined();
      expect(settings.requireUppercase).toBeUndefined();
      expect(settings.requireNonAlphanumeric).toBeUndefined();
      expect(settings.requiredUniqueChars).toBeUndefined();
    });

    it('should parse integer settings correctly', () => {
      const store: SettingsStore = {
        getSetting: vi.fn((key: string) => {
          if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
          if (key === PASSWORD_SETTING_KEYS.maxLength) return '128';
          if (key === PASSWORD_SETTING_KEYS.requiredUniqueChars) return '4';
          return undefined;
        }),
      };

      const settings = getPasswordSettings(store);

      expect(settings.requiredLength).toBe(8);
      expect(settings.maxLength).toBe(128);
      expect(settings.requiredUniqueChars).toBe(4);
    });

    it('should parse boolean settings correctly', () => {
      const store: SettingsStore = {
        getSetting: vi.fn((key: string) => {
          if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'true';
          if (key === PASSWORD_SETTING_KEYS.requireLowercase) return 'True';
          if (key === PASSWORD_SETTING_KEYS.requireUppercase) return 'false';
          if (key === PASSWORD_SETTING_KEYS.requireNonAlphanumeric) return 'FALSE';
          return undefined;
        }),
      };

      const settings = getPasswordSettings(store);

      expect(settings.requireDigit).toBe(true);
      expect(settings.requireLowercase).toBe(true);
      expect(settings.requireUppercase).toBe(false);
      expect(settings.requireNonAlphanumeric).toBe(false);
    });

    it('should handle invalid integer values', () => {
      const store: SettingsStore = {
        getSetting: vi.fn((key: string) => {
          if (key === PASSWORD_SETTING_KEYS.requiredLength) return 'not-a-number';
          return undefined;
        }),
      };

      const settings = getPasswordSettings(store);

      expect(settings.requiredLength).toBeUndefined();
    });
  });

  describe('getPasswordValidators', () => {
    it('should return empty array when no settings are configured', () => {
      const store: SettingsStore = {
        getSetting: vi.fn().mockReturnValue(undefined),
      };

      const validators = getPasswordValidators(store);

      expect(validators).toEqual([]);
    });

    describe('requiredLength validator', () => {
      it('should create validator when requiredLength is set', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);

        expect(validators.length).toBe(1);
      });

      it('should pass when password meets length requirement', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('password123');

        expect(result).toBe(true);
      });

      it('should fail when password is too short', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('short');

        expect(result).toBe('Password must be at least 8 characters');
      });

      it('should fail when password is empty', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('');

        expect(result).toBe('Password must be at least 8 characters');
      });

      it('should not create validator when requiredLength is 0', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '0';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);

        expect(validators.length).toBe(0);
      });
    });

    describe('maxLength validator', () => {
      it('should pass when password is within max length', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.maxLength) return '20';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('shortpassword');

        expect(result).toBe(true);
      });

      it('should fail when password exceeds max length', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.maxLength) return '10';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('verylongpassword');

        expect(result).toBe('Password must be at most 10 characters');
      });

      it('should pass for empty password (empty check is separate)', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.maxLength) return '10';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('');

        expect(result).toBe(true);
      });
    });

    describe('requireDigit validator', () => {
      it('should pass when password contains digit', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('password1');

        expect(result).toBe(true);
      });

      it('should fail when password has no digit', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('password');

        expect(result).toBe('Password must contain at least one digit');
      });

      it('should not create validator when requireDigit is false', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'false';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);

        expect(validators.length).toBe(0);
      });
    });

    describe('requireLowercase validator', () => {
      it('should pass when password contains lowercase', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireLowercase) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('PASSWORDa');

        expect(result).toBe(true);
      });

      it('should fail when password has no lowercase', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireLowercase) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('PASSWORD123');

        expect(result).toBe('Password must contain at least one lowercase letter');
      });
    });

    describe('requireUppercase validator', () => {
      it('should pass when password contains uppercase', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireUppercase) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('passwordA');

        expect(result).toBe(true);
      });

      it('should fail when password has no uppercase', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireUppercase) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('password123');

        expect(result).toBe('Password must contain at least one uppercase letter');
      });
    });

    describe('requireNonAlphanumeric validator', () => {
      it('should pass when password contains special character', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireNonAlphanumeric) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('password!');

        expect(result).toBe(true);
      });

      it('should fail when password has no special character', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireNonAlphanumeric) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('password123');

        expect(result).toBe('Password must contain at least one special character');
      });

      it('should recognize various special characters', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requireNonAlphanumeric) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);

        expect(validators[0]('pass@word')).toBe(true);
        expect(validators[0]('pass#word')).toBe(true);
        expect(validators[0]('pass$word')).toBe(true);
        expect(validators[0]('pass%word')).toBe(true);
        expect(validators[0]('pass&word')).toBe(true);
        expect(validators[0]('pass*word')).toBe(true);
        expect(validators[0]('pass-word')).toBe(true);
        expect(validators[0]('pass_word')).toBe(true);
      });
    });

    describe('requiredUniqueChars validator', () => {
      it('should pass when password has enough unique characters', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredUniqueChars) return '4';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('abcd');

        expect(result).toBe(true);
      });

      it('should fail when password lacks unique characters', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredUniqueChars) return '4';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('aaa');

        expect(result).toBe('Password must contain at least 4 unique characters');
      });

      it('should pass for empty password', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredUniqueChars) return '4';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const result = validators[0]('');

        expect(result).toBe(true);
      });

      it('should count unique characters correctly', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredUniqueChars) return '5';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);

        // 'aaaabbbb' has only 2 unique chars
        expect(validators[0]('aaaabbbb')).toBe('Password must contain at least 5 unique characters');
        // 'abcde' has 5 unique chars
        expect(validators[0]('abcde')).toBe(true);
      });
    });

    describe('multiple validators', () => {
      it('should create multiple validators when multiple settings are enabled', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
            if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'true';
            if (key === PASSWORD_SETTING_KEYS.requireUppercase) return 'true';
            if (key === PASSWORD_SETTING_KEYS.requireNonAlphanumeric) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);

        expect(validators.length).toBe(4);
      });

      it('should validate strong password with all requirements', () => {
        const store: SettingsStore = {
          getSetting: vi.fn((key: string) => {
            if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
            if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'true';
            if (key === PASSWORD_SETTING_KEYS.requireLowercase) return 'true';
            if (key === PASSWORD_SETTING_KEYS.requireUppercase) return 'true';
            if (key === PASSWORD_SETTING_KEYS.requireNonAlphanumeric) return 'true';
            return undefined;
          }),
        };

        const validators = getPasswordValidators(store);
        const password = 'Passw0rd!';

        validators.forEach((validator) => {
          expect(validator(password)).toBe(true);
        });
      });
    });
  });

  describe('getPasswordValidationRules', () => {
    it('should return RegisterOptions with required rule', () => {
      const store: SettingsStore = {
        getSetting: vi.fn().mockReturnValue(undefined),
      };

      const rules = getPasswordValidationRules(store);

      expect(rules.required).toBe('Password is required');
    });

    it('should include minLength when requiredLength is set', () => {
      const store: SettingsStore = {
        getSetting: vi.fn((key: string) => {
          if (key === PASSWORD_SETTING_KEYS.requiredLength) return '8';
          return undefined;
        }),
      };

      const rules = getPasswordValidationRules(store);

      expect(rules.minLength).toEqual({
        value: 8,
        message: 'Password must be at least 8 characters',
      });
    });

    it('should include maxLength when maxLength is set', () => {
      const store: SettingsStore = {
        getSetting: vi.fn((key: string) => {
          if (key === PASSWORD_SETTING_KEYS.maxLength) return '128';
          return undefined;
        }),
      };

      const rules = getPasswordValidationRules(store);

      expect(rules.maxLength).toEqual({
        value: 128,
        message: 'Password must be at most 128 characters',
      });
    });

    it('should include validate rules for all enabled validators', () => {
      const store: SettingsStore = {
        getSetting: vi.fn((key: string) => {
          if (key === PASSWORD_SETTING_KEYS.requireDigit) return 'true';
          if (key === PASSWORD_SETTING_KEYS.requireUppercase) return 'true';
          return undefined;
        }),
      };

      const rules = getPasswordValidationRules(store);

      expect(rules.validate).toBeDefined();
      expect(typeof rules.validate).toBe('object');
      expect(Object.keys(rules.validate as object).length).toBe(2);
    });

    it('should not include minLength/maxLength when not set', () => {
      const store: SettingsStore = {
        getSetting: vi.fn().mockReturnValue(undefined),
      };

      const rules = getPasswordValidationRules(store);

      expect(rules.minLength).toBeUndefined();
      expect(rules.maxLength).toBeUndefined();
    });
  });
});
