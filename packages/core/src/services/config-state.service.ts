import { RootState } from '../store';
import { ConfigState } from '../slices/config.slice';
import { Config, ABP } from '../models';

/**
 * ConfigStateService provides access to configuration state.
 * Renamed from ConfigService in v1.1.0 to align with Angular ABP.
 * @since 1.1.0
 */
export class ConfigStateService {
  constructor(private getState: () => RootState) {}

  getAll(): ConfigState {
    return this.getState().config;
  }

  /**
   * Get application info from environment configuration
   * @since 1.1.0
   */
  getApplicationInfo(): Config.Application | undefined {
    return this.getState().config.environment.application;
  }

  getOne<K extends keyof ConfigState>(key: K): ConfigState[K] {
    return this.getState().config[key];
  }

  getDeep(keys: string | string[]): any {
    const keyArray = typeof keys === 'string' ? keys.split('.') : keys;

    if (!Array.isArray(keyArray)) {
      throw new Error('The argument must be a dot string or an string array.');
    }

    return keyArray.reduce((acc: any, val: string) => {
      if (acc) {
        return acc[val];
      }
      return undefined;
    }, this.getState().config);
  }

  /**
   * Find a route by path, name, or url
   * @param path - Optional path to match
   * @param name - Optional name to match
   * @param url - Optional url to match (added in v1.1.0)
   * @since 1.1.0
   */
  getRoute(path?: string, name?: string, url?: string): ABP.FullRoute | undefined {
    return this.findRouteDeep(this.getState().config.routes, path, name, url);
  }

  private findRouteDeep(
    routes: ABP.FullRoute[],
    path?: string,
    name?: string,
    url?: string
  ): ABP.FullRoute | undefined {
    for (const route of routes) {
      if (
        (path && route.path === path) ||
        (name && route.name === name) ||
        (url && route.url === url)
      ) {
        return route;
      }
      if (route.children && route.children.length) {
        const found = this.findRouteDeep(route.children as ABP.FullRoute[], path, name, url);
        if (found) return found;
      }
    }
    return undefined;
  }

  getSetting(key: string): string | undefined {
    return this.getState().config.setting.values[key];
  }

  /**
   * Get all settings, optionally filtered by keyword
   * @param keyword - Optional keyword to filter setting keys
   * @since 1.1.0
   */
  getSettings(keyword?: string): Record<string, string> {
    const settings = this.getState().config.setting.values;
    if (!keyword) return { ...settings };

    return Object.keys(settings)
      .filter((key) => key.includes(keyword))
      .reduce<Record<string, string>>((acc, key) => {
        acc[key] = settings[key];
        return acc;
      }, {});
  }

  getApiUrl(key: string = 'default'): string {
    return this.getState().config.environment.apis?.[key]?.url || '';
  }

  getGrantedPolicy(condition: string = ''): boolean {
    if (!condition) return true;

    const state = this.getState().config;
    const keys = condition
      .replace(/\(|\)|\!|\s/g, '')
      .split(/\|\||&&/)
      .filter((key) => key);

    if (!keys.length) return true;

    const getPolicy = (key: string): boolean => state.auth.grantedPolicies[key] ?? false;

    if (keys.length > 1) {
      let evaluatedCondition = condition;
      keys.forEach((key) => {
        const value = getPolicy(key);
        evaluatedCondition = evaluatedCondition.replace(key, String(value));
      });
      return this.evaluateBooleanExpression(evaluatedCondition);
    }

    return getPolicy(condition);
  }

  /**
   * Get a localized string by key with interpolation support
   * @param key - Localization key (string) or object with key and defaultValue
   * @param interpolateParams - Parameters to interpolate into the string
   * @since 1.1.0
   */
  getLocalization(
    key: string | Config.LocalizationWithDefault,
    ...interpolateParams: string[]
  ): string {
    const keyStr = typeof key === 'string' ? key : key.key;
    const defaultValue = typeof key === 'string' ? keyStr : key.defaultValue;

    const state = this.getState().config;
    const { values } = state.localization;
    const defaultResourceName = state.environment.localization?.defaultResourceName || '';

    // Parse key format: "ResourceName::Key" or just "Key"
    const parts = keyStr.split('::');
    let resourceName: string;
    let localizationKey: string;

    if (parts.length === 2) {
      resourceName = parts[0];
      localizationKey = parts[1];
    } else {
      resourceName = defaultResourceName;
      localizationKey = keyStr;
    }

    let result = values[resourceName]?.[localizationKey] ?? defaultValue;

    // Interpolate parameters
    if (interpolateParams.length > 0) {
      interpolateParams.forEach((param, index) => {
        result = result.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
        result = result.replace(new RegExp(`\\{\\s*'${index}'\\s*\\}`, 'g'), param);
      });
    }

    return result;
  }

  private evaluateBooleanExpression(expr: string): boolean {
    expr = expr.replace(/true/g, '1').replace(/false/g, '0');
    const tokens = expr.match(/[()!]|&&|\|\||[01]/g) || [];
    let pos = 0;

    const parseOr = (): boolean => {
      let result = parseAnd();
      while (tokens[pos] === '||') {
        pos++;
        result = result || parseAnd();
      }
      return result;
    };

    const parseAnd = (): boolean => {
      let result = parseNot();
      while (tokens[pos] === '&&') {
        pos++;
        result = result && parseNot();
      }
      return result;
    };

    const parseNot = (): boolean => {
      if (tokens[pos] === '!') {
        pos++;
        return !parseNot();
      }
      return parsePrimary();
    };

    const parsePrimary = (): boolean => {
      if (tokens[pos] === '(') {
        pos++;
        const result = parseOr();
        pos++;
        return result;
      }
      const val = tokens[pos] === '1';
      pos++;
      return val;
    };

    return parseOr();
  }
}

/**
 * @deprecated Use ConfigStateService instead. Will be removed in v2.0.0
 */
export { ConfigStateService as ConfigService };
