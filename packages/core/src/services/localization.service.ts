import { RootState } from '../store';

export class LocalizationService {
  constructor(private getState: () => RootState) {}

  /**
   * Get a localized string by key
   * @param key The localization key in format "ResourceName::Key" or "::Key" for default resource
   * @param interpolateParams Parameters to interpolate into the string
   */
  t(key: string, ...interpolateParams: string[]): string {
    const state = this.getState().config;
    const keys = key.split('::') as [string, string];

    if (keys[0] === '') {
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
        copy = copy.replace(`'{${index}}'`, param);
      });
    }

    return copy || key;
  }

  /**
   * Alias for t - for developers familiar with ABP Angular
   * @param key The localization key in format "ResourceName::Key" or "::Key" for default resource
   * @param interpolateParams Parameters to interpolate into the string
   */
  instant(key: string, ...interpolateParams: string[]): string {
    return this.t(key, ...interpolateParams);
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
