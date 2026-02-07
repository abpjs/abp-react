/**
 * PermissionService - Service for checking granted policies
 * Translated from @abp/ng.core v4.0.0
 *
 * @since 4.0.0
 */

import { RootState } from '../store';

export class PermissionService {
  constructor(private getState: () => RootState) {}

  /**
   * Check if a policy is granted
   * Supports complex conditions with && and || operators
   * @param key - The policy key or condition string
   * @returns boolean indicating if the policy is granted
   */
  getGrantedPolicy(key: string = ''): boolean {
    if (!key) return true;

    const state = this.getState().config;
    const keys = key
      .replace(/\(|\)|!|\s/g, '')
      .split(/\|\||&&/)
      .filter((k) => k);

    if (!keys.length) return true;

    const getPolicy = (policyKey: string): boolean =>
      state.auth.grantedPolicies[policyKey] ?? false;

    if (keys.length > 1) {
      let evaluatedCondition = key;
      keys.forEach((k) => {
        const value = getPolicy(k);
        evaluatedCondition = evaluatedCondition.replace(k, String(value));
      });
      return this.evaluateBooleanExpression(evaluatedCondition);
    }

    return getPolicy(key);
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
