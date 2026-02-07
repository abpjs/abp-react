/**
 * Localization Utilities
 * Translated from @abp/ng.core v4.0.0
 *
 * Utility functions for working with localization data.
 *
 * @since 2.9.0
 * @updated 4.0.0 - Accept ApplicationLocalizationConfigurationDto
 */

import { ApplicationLocalizationConfigurationDto } from '../models/proxy/application-configurations';

/**
 * Internal localization data type for functions that only need values.
 * Accepts both ApplicationConfiguration.Localization and ApplicationLocalizationConfigurationDto.
 */
type LocalizationData = Pick<ApplicationLocalizationConfigurationDto, 'values'>;

/**
 * RTL (Right-to-Left) locales
 */
const RTL_LOCALES = [
  'ar', // Arabic
  'arc', // Aramaic
  'dv', // Divehi
  'fa', // Persian
  'ha', // Hausa
  'he', // Hebrew
  'khw', // Khowar
  'ks', // Kashmiri
  'ku', // Kurdish
  'ps', // Pashto
  'ur', // Urdu
  'yi', // Yiddish
];

/**
 * Get the text direction (ltr or rtl) for a given locale
 * @param locale - The locale code (e.g., 'en', 'ar', 'he')
 * @returns 'ltr' for left-to-right locales, 'rtl' for right-to-left locales
 * @since 2.9.0
 */
export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  const localeCode = locale.split('-')[0].toLowerCase();
  return RTL_LOCALES.includes(localeCode) ? 'rtl' : 'ltr';
}

/**
 * Create a localizer function from localization data
 * @param localization - The localization configuration containing resource values
 * @returns A function that takes (resourceName, key, defaultValue) and returns the localized string
 * @since 2.9.0
 * @updated 4.0.0 - Accepts ApplicationLocalizationConfigurationDto
 */
export function createLocalizer(
  localization: LocalizationData
): (resourceName: string, key: string, defaultValue: string) => string {
  return (resourceName: string, key: string, defaultValue: string): string => {
    if (!localization?.values) return defaultValue;

    const resourceValues = localization.values[resourceName];
    if (!resourceValues) return defaultValue;

    return resourceValues[key] ?? defaultValue;
  };
}

/**
 * Create a localizer function with fallback across multiple resources and keys
 * @param localization - The localization configuration containing resource values
 * @returns A function that takes (resourceNames[], keys[], defaultValue) and returns the localized string
 * @since 2.9.0
 * @updated 4.0.0 - Accepts ApplicationLocalizationConfigurationDto
 */
export function createLocalizerWithFallback(
  localization: LocalizationData
): (resourceNames: string[], keys: string[], defaultValue: string) => string {
  return (resourceNames: string[], keys: string[], defaultValue: string): string => {
    if (!localization?.values) return defaultValue;

    for (const resourceName of resourceNames) {
      const resourceValues = localization.values[resourceName];
      if (!resourceValues) continue;

      for (const key of keys) {
        const value = resourceValues[key];
        if (value !== undefined) {
          return value;
        }
      }
    }

    return defaultValue;
  };
}

/**
 * Create a localization pipe key generator
 * Generates a key string suitable for use with localization pipes
 * @param localization - The localization configuration containing resource values
 * @returns A function that takes (resourceNames[], keys[], defaultKey) and returns the first found key or defaultKey
 * @since 2.9.0
 * @updated 4.0.0 - Accepts ApplicationLocalizationConfigurationDto
 */
export function createLocalizationPipeKeyGenerator(
  localization: LocalizationData
): (resourceNames: string[], keys: string[], defaultKey: string) => string {
  return (resourceNames: string[], keys: string[], defaultKey: string): string => {
    if (!localization?.values) return defaultKey;

    for (const resourceName of resourceNames) {
      const resourceValues = localization.values[resourceName];
      if (!resourceValues) continue;

      for (const key of keys) {
        if (resourceValues[key] !== undefined) {
          return `${resourceName}::${key}`;
        }
      }
    }

    return defaultKey;
  };
}
