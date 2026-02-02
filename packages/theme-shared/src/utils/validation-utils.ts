/**
 * Validation utility functions for form validation.
 * Translated from @abp/ng.theme.shared/lib/utils/validation-utils.ts
 *
 * @since 2.7.0
 */

import type { RegisterOptions } from 'react-hook-form';

/**
 * Password validation settings from ABP configuration.
 * These values come from Identity.Settings.Password in the ABP framework.
 * @since 2.7.0
 */
export interface PasswordSettings {
  /** Minimum required length for passwords */
  requiredLength?: number;
  /** Maximum allowed length for passwords */
  maxLength?: number;
  /** Whether passwords must contain at least one digit */
  requireDigit?: boolean;
  /** Whether passwords must contain at least one lowercase letter */
  requireLowercase?: boolean;
  /** Whether passwords must contain at least one uppercase letter */
  requireUppercase?: boolean;
  /** Whether passwords must contain at least one non-alphanumeric character */
  requireNonAlphanumeric?: boolean;
  /** Number of unique characters required */
  requiredUniqueChars?: number;
}

/**
 * Password validator function type for custom validation.
 * Returns true if valid, or an error message string if invalid.
 * @since 2.7.0
 */
export type PasswordValidator = (value: string) => true | string;

/**
 * Store-like interface for accessing ABP settings.
 * This matches the pattern used by @abpjs/core's useAbpConfig hook.
 * @since 2.7.0
 */
export interface SettingsStore {
  getSetting: (key: string) => string | undefined;
}

/**
 * Default password setting keys in ABP Identity module.
 * @since 2.7.0
 */
export const PASSWORD_SETTING_KEYS = {
  requiredLength: 'Abp.Identity.Password.RequiredLength',
  maxLength: 'Abp.Identity.Password.MaxLength',
  requireDigit: 'Abp.Identity.Password.RequireDigit',
  requireLowercase: 'Abp.Identity.Password.RequireLowercase',
  requireUppercase: 'Abp.Identity.Password.RequireUppercase',
  requireNonAlphanumeric: 'Abp.Identity.Password.RequireNonAlphanumeric',
  requiredUniqueChars: 'Abp.Identity.Password.RequiredUniqueChars',
} as const;

/**
 * Parse boolean setting value from string.
 * @param value - The setting value string
 * @returns boolean or undefined
 * @since 2.7.0
 */
function parseBooleanSetting(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value.toLowerCase() === 'true';
}

/**
 * Parse integer setting value from string.
 * @param value - The setting value string
 * @returns number or undefined
 * @since 2.7.0
 */
function parseIntegerSetting(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
}

/**
 * Get password settings from the store.
 * @param store - The settings store (typically from useAbpConfig hook)
 * @returns Password settings object
 * @since 2.7.0
 */
export function getPasswordSettings(store: SettingsStore): PasswordSettings {
  return {
    requiredLength: parseIntegerSetting(store.getSetting(PASSWORD_SETTING_KEYS.requiredLength)),
    maxLength: parseIntegerSetting(store.getSetting(PASSWORD_SETTING_KEYS.maxLength)),
    requireDigit: parseBooleanSetting(store.getSetting(PASSWORD_SETTING_KEYS.requireDigit)),
    requireLowercase: parseBooleanSetting(store.getSetting(PASSWORD_SETTING_KEYS.requireLowercase)),
    requireUppercase: parseBooleanSetting(store.getSetting(PASSWORD_SETTING_KEYS.requireUppercase)),
    requireNonAlphanumeric: parseBooleanSetting(store.getSetting(PASSWORD_SETTING_KEYS.requireNonAlphanumeric)),
    requiredUniqueChars: parseIntegerSetting(store.getSetting(PASSWORD_SETTING_KEYS.requiredUniqueChars)),
  };
}

/**
 * Get password validators based on ABP Identity settings.
 *
 * This is the React equivalent of Angular's getPasswordValidators function.
 * It reads password requirements from ABP settings and returns validation functions
 * compatible with react-hook-form's validate option.
 *
 * @param store - The settings store (typically from useAbpConfig hook)
 * @returns Array of validator functions for password validation
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * import { useAbpConfig } from '@abpjs/core';
 * import { getPasswordValidators } from '@abpjs/theme-shared';
 * import { useForm } from 'react-hook-form';
 *
 * function PasswordForm() {
 *   const { getSetting } = useAbpConfig();
 *   const validators = getPasswordValidators({ getSetting });
 *
 *   const { register } = useForm();
 *
 *   return (
 *     <input
 *       {...register('password', {
 *         validate: Object.fromEntries(
 *           validators.map((v, i) => [`rule${i}`, v])
 *         )
 *       })}
 *     />
 *   );
 * }
 * ```
 */
export function getPasswordValidators(store: SettingsStore): PasswordValidator[] {
  const settings = getPasswordSettings(store);
  const validators: PasswordValidator[] = [];

  // Required length validator
  if (settings.requiredLength && settings.requiredLength > 0) {
    validators.push((value: string) => {
      if (!value || value.length < settings.requiredLength!) {
        return `Password must be at least ${settings.requiredLength} characters`;
      }
      return true;
    });
  }

  // Max length validator
  if (settings.maxLength && settings.maxLength > 0) {
    validators.push((value: string) => {
      if (value && value.length > settings.maxLength!) {
        return `Password must be at most ${settings.maxLength} characters`;
      }
      return true;
    });
  }

  // Require digit validator
  if (settings.requireDigit) {
    validators.push((value: string) => {
      if (!value || !/\d/.test(value)) {
        return 'Password must contain at least one digit';
      }
      return true;
    });
  }

  // Require lowercase validator
  if (settings.requireLowercase) {
    validators.push((value: string) => {
      if (!value || !/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter';
      }
      return true;
    });
  }

  // Require uppercase validator
  if (settings.requireUppercase) {
    validators.push((value: string) => {
      if (!value || !/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter';
      }
      return true;
    });
  }

  // Require non-alphanumeric validator
  if (settings.requireNonAlphanumeric) {
    validators.push((value: string) => {
      if (!value || !/[^a-zA-Z0-9]/.test(value)) {
        return 'Password must contain at least one special character';
      }
      return true;
    });
  }

  // Required unique characters validator
  if (settings.requiredUniqueChars && settings.requiredUniqueChars > 0) {
    validators.push((value: string) => {
      if (!value) return true;
      const uniqueChars = new Set(value).size;
      if (uniqueChars < settings.requiredUniqueChars!) {
        return `Password must contain at least ${settings.requiredUniqueChars} unique characters`;
      }
      return true;
    });
  }

  return validators;
}

/**
 * Convert password validators to react-hook-form RegisterOptions.
 * This is a convenience function to create validation rules for react-hook-form.
 *
 * @param store - The settings store (typically from useAbpConfig hook)
 * @returns RegisterOptions with validate rules for react-hook-form
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * import { useAbpConfig } from '@abpjs/core';
 * import { getPasswordValidationRules } from '@abpjs/theme-shared';
 * import { useForm } from 'react-hook-form';
 *
 * function PasswordForm() {
 *   const { getSetting } = useAbpConfig();
 *   const { register } = useForm();
 *
 *   return (
 *     <input {...register('password', getPasswordValidationRules({ getSetting }))} />
 *   );
 * }
 * ```
 */
export function getPasswordValidationRules(store: SettingsStore): RegisterOptions {
  const validators = getPasswordValidators(store);
  const settings = getPasswordSettings(store);

  const validate: Record<string, PasswordValidator> = {};
  validators.forEach((validator, index) => {
    validate[`passwordRule${index}`] = validator;
  });

  return {
    required: 'Password is required',
    minLength: settings.requiredLength
      ? {
          value: settings.requiredLength,
          message: `Password must be at least ${settings.requiredLength} characters`,
        }
      : undefined,
    maxLength: settings.maxLength
      ? {
          value: settings.maxLength,
          message: `Password must be at most ${settings.maxLength} characters`,
        }
      : undefined,
    validate,
  };
}
