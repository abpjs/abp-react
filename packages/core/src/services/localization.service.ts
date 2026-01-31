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
  get(
    key: string | Config.LocalizationWithDefault,
    ...interpolateParams: string[]
  ): string {
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
  instant(
    key: string | Config.LocalizationWithDefault,
    ...interpolateParams: string[]
  ): string {
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
}
