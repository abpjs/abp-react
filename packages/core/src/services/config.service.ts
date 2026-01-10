import { RootState } from '../store';
import { ConfigState } from '../slices/config.slice';

export class ConfigService {
  constructor(private getState: () => RootState) {}

  getAll(): ConfigState {
    return this.getState().config;
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

  getSetting(key: string): string | undefined {
    return this.getState().config.setting.values[key];
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
