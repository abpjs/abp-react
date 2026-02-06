import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectGrantedPolicy } from '../slices/config.slice';
import { RootState } from '../store';

/**
 * Hook to check if a permission/policy is granted
 * @param condition The policy condition (e.g., "PolicyName" or "Policy1 && Policy2")
 * @returns boolean indicating if the policy is granted
 */
export function usePermission(condition: string = ''): boolean {
  const selector = useMemo(() => selectGrantedPolicy(condition), [condition]);
  return useSelector(selector);
}

/**
 * Hook to check multiple permissions at once
 * @param conditions Array of policy conditions
 * @returns Object with each condition as key and boolean as value
 */
export function usePermissions(conditions: string[]): Record<string, boolean> {
  const auth = useSelector((state: RootState) => state.config.auth);

  return useMemo(() => {
    const result: Record<string, boolean> = {};

    conditions.forEach((condition) => {
      if (!condition) {
        result[condition] = true;
        return;
      }

      const keys = condition
        .replace(/\(|\)|!|\s/g, '')
        .split(/\|\||&&/)
        .filter((key) => key);

      if (!keys.length) {
        result[condition] = true;
        return;
      }

      const getPolicy = (key: string): boolean => auth.grantedPolicies[key] ?? false;

      if (keys.length > 1) {
        let evaluatedCondition = condition;
        keys.forEach((key) => {
          const value = getPolicy(key);
          evaluatedCondition = evaluatedCondition.replace(key, String(value));
        });
        result[condition] = evaluateBooleanExpression(evaluatedCondition);
      } else {
        result[condition] = getPolicy(condition);
      }
    });

    return result;
  }, [auth.grantedPolicies, conditions]);
}

function evaluateBooleanExpression(expr: string): boolean {
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
