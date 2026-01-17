import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectLocalization, selectEnvironment } from '../slices/config.slice';

/**
 * Hook to get localized strings
 * @returns Object with localization utilities
 */
export function useLocalization() {
  const localization = useSelector(selectLocalization);
  const environment = useSelector(selectEnvironment);

  /**
   * Get a localized string by key
   * @param key The localization key in format "ResourceName::Key" or "::Key" for default resource
   * @param interpolateParams Parameters to interpolate into the string
   */
  const t = useCallback(
    (key: string, ...interpolateParams: string[]): string => {
      const keys = key.split('::') as [string, string];

      if (keys[0] === '') {
        const defaultResourceName = environment.localization?.defaultResourceName;
        if (!defaultResourceName) {
          console.warn(`Please check your environment. May you forget set defaultResourceName?`);
          return key;
        }
        keys[0] = defaultResourceName;
      }

      let copy = keys.reduce((acc: any, val: string) => {
        if (acc) {
          return acc[val];
        }
        return undefined;
      }, localization.values);

      if (copy && interpolateParams && interpolateParams.length) {
        interpolateParams.forEach((param, index) => {
          copy = copy.replace(`'{${index}}'`, param);
        });
      }

      return copy || key;
    },
    [localization.values, environment.localization?.defaultResourceName]
  );

  /**
   * Alias for t - for developers familiar with ABP Angular
   */
  const instant = t;

  /**
   * Get all available languages
   */
  const languages = localization.languages;

  return {
    instant,
    t,
    languages,
    localization,
  };
}

/**
 * Simple hook to get a single localized string
 * @param key The localization key
 * @param interpolateParams Parameters to interpolate
 */
export function useTranslation(key: string, ...interpolateParams: string[]): string {
  const { t } = useLocalization();
  return t(key, ...interpolateParams);
}
