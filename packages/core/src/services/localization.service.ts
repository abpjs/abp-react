/**
 * Localization Service
 * Translated from @abp/ng.core v2.9.0
 *
 * @since 1.0.0
 * @updated 2.9.0 - Added localize, localizeSync, localizeWithFallback, localizeWithFallbackSync methods
 */

import { RootState } from '../store';
import { Config } from '../models';

export class LocalizationService {
  constructor(private getState: () => RootState) {}

  /**
   * Get current language from session state
   */
  get currentLang(): string {
    return this.getState().session.language;
  }

  /**
   * Get a localized string by key
   * @param key The localization key in format "ResourceName::Key" or "::Key" for default resource,
   *            or a LocalizationWithDefault object
   * @param interpolateParams Parameters to interpolate into the string
   * @since 1.1.0 - Now accepts Config.LocalizationWithDefault
   */
  get(key: string | Config.LocalizationWithDefault, ...interpolateParams: string[]): string {
    const keyStr = typeof key === 'string' ? key : key.key;
    const defaultValue = typeof key === 'string' ? keyStr : key.defaultValue;

    if (!keyStr) return defaultValue;

    const state = this.getState().config;
    const keys = keyStr.split('::');

    if (keys.length === 1) {
      // No resource name specified, use default
      const defaultResourceName = state.environment.localization?.defaultResourceName;
      if (defaultResourceName) {
        keys.unshift(defaultResourceName);
      }
    } else if (keys[0] === '') {
      const defaultResourceName = state.environment.localization?.defaultResourceName;
      if (!defaultResourceName) {
        throw new Error(`Please check your environment. May you forget set defaultResourceName?
          Here is the example:
           { production: false,
             localization: {
               defaultResourceName: 'MyProjectName'
              }
           }`);
      }
      keys[0] = defaultResourceName;
    }

    let copy = keys.reduce((acc: any, val: string) => {
      if (acc) {
        return acc[val];
      }
      return undefined;
    }, state.localization.values);

    if (copy && interpolateParams && interpolateParams.length) {
      interpolateParams.forEach((param, index) => {
        copy = copy.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
        copy = copy.replace(new RegExp(`'\\{${index}\\}'`, 'g'), param);
      });
    }

    return copy || defaultValue;
  }

  /**
   * Get a localized string by key (synchronous)
   * @param key The localization key in format "ResourceName::Key" or "::Key" for default resource,
   *            or a LocalizationWithDefault object
   * @param interpolateParams Parameters to interpolate into the string
   * @since 1.1.0 - Now accepts Config.LocalizationWithDefault
   */
  instant(key: string | Config.LocalizationWithDefault, ...interpolateParams: string[]): string {
    return this.get(key, ...interpolateParams);
  }

  /**
   * Alias for get - shorthand for translation
   * @param key The localization key in format "ResourceName::Key" or "::Key" for default resource
   * @param interpolateParams Parameters to interpolate into the string
   */
  t(key: string | Config.LocalizationWithDefault, ...interpolateParams: string[]): string {
    return this.get(key, ...interpolateParams);
  }

  /**
   * Get all available languages
   */
  getLanguages() {
    return this.getState().config.localization.languages;
  }

  /**
   * Get all localization values
   */
  getLocalizationValues() {
    return this.getState().config.localization.values;
  }

  /**
   * Get a localized string by resource name and key
   * Returns a promise that resolves with the localized string
   * @param resourceName - The resource name (e.g., 'AbpIdentity')
   * @param key - The localization key
   * @param defaultValue - The default value if not found
   * @returns Promise that resolves with the localized string
   * @since 2.9.0
   */
  async localize(resourceName: string, key: string, defaultValue: string): Promise<string> {
    return this.localizeSync(resourceName, key, defaultValue);
  }

  /**
   * Get a localized string by resource name and key (synchronous)
   * @param resourceName - The resource name (e.g., 'AbpIdentity')
   * @param key - The localization key
   * @param defaultValue - The default value if not found
   * @returns The localized string or default value
   * @since 2.9.0
   */
  localizeSync(resourceName: string, key: string, defaultValue: string): string {
    const state = this.getState().config;
    const values = state.localization?.values;

    if (!values) return defaultValue;

    const resourceValues = values[resourceName];
    if (!resourceValues) return defaultValue;

    return resourceValues[key] ?? defaultValue;
  }

  /**
   * Get a localized string with fallback across multiple resources and keys
   * Tries each resource/key combination until a value is found
   * @param resourceNames - Array of resource names to try
   * @param keys - Array of keys to try
   * @param defaultValue - The default value if not found
   * @returns Promise that resolves with the localized string
   * @since 2.9.0
   */
  async localizeWithFallback(
    resourceNames: string[],
    keys: string[],
    defaultValue: string
  ): Promise<string> {
    return this.localizeWithFallbackSync(resourceNames, keys, defaultValue);
  }

  /**
   * Get a localized string with fallback across multiple resources and keys (synchronous)
   * Tries each resource/key combination until a value is found
   * @param resourceNames - Array of resource names to try
   * @param keys - Array of keys to try
   * @param defaultValue - The default value if not found
   * @returns The localized string or default value
   * @since 2.9.0
   */
  localizeWithFallbackSync(
    resourceNames: string[],
    keys: string[],
    defaultValue: string
  ): string {
    const state = this.getState().config;
    const values = state.localization?.values;

    if (!values) return defaultValue;

    for (const resourceName of resourceNames) {
      const resourceValues = values[resourceName];
      if (!resourceValues) continue;

      for (const key of keys) {
        const value = resourceValues[key];
        if (value !== undefined) {
          return value;
        }
      }
    }

    return defaultValue;
  }
}
