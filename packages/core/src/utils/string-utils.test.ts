import { describe, it, expect } from 'vitest';
import { createTokenParser } from './string-utils';

describe('string-utils (v3.1.0)', () => {
  describe('createTokenParser', () => {
    it('should parse simple two-token format', () => {
      const parser = createTokenParser('{0}.{1}');
      const result = parser('tenant.user');

      expect(result).toEqual({
        '0': ['tenant'],
        '1': ['user'],
      });
    });

    it('should parse single token format', () => {
      const parser = createTokenParser('{0}');
      const result = parser('value');

      expect(result).toEqual({
        '0': ['value'],
      });
    });

    it('should handle multiple tokens with different separators', () => {
      const parser = createTokenParser('{0}-{1}_{2}');
      const result = parser('abc-def_ghi');

      expect(result).toEqual({
        '0': ['abc'],
        '1': ['def'],
        '2': ['ghi'],
      });
    });

    it('should handle prefix and suffix text', () => {
      const parser = createTokenParser('prefix-{0}-suffix');
      const result = parser('prefix-value-suffix');

      expect(result).toEqual({
        '0': ['value'],
      });
    });

    it('should return empty object for non-matching strings', () => {
      const parser = createTokenParser('{0}.{1}');
      const result = parser('no-dot-here');

      expect(result).toEqual({});
    });

    it('should handle complex format patterns', () => {
      const parser = createTokenParser('api/{0}/resources/{1}/items/{2}');
      const result = parser('api/v1/resources/users/items/123');

      expect(result).toEqual({
        '0': ['v1'],
        '1': ['users'],
        '2': ['123'],
      });
    });

    it('should handle tokens at the beginning', () => {
      const parser = createTokenParser('{0}@domain.com');
      const result = parser('user@domain.com');

      expect(result).toEqual({
        '0': ['user'],
      });
    });

    it('should handle tokens at the end', () => {
      const parser = createTokenParser('file.{0}');
      const result = parser('file.txt');

      expect(result).toEqual({
        '0': ['txt'],
      });
    });

    it('should escape special regex characters in format', () => {
      const parser = createTokenParser('{0}[test]');
      const result = parser('value[test]');

      expect(result).toEqual({
        '0': ['value'],
      });
    });

    it('should handle parentheses in format', () => {
      const parser = createTokenParser('({0})');
      const result = parser('(content)');

      expect(result).toEqual({
        '0': ['content'],
      });
    });

    it('should handle dots in format', () => {
      const parser = createTokenParser('{0}.{1}.{2}');
      const result = parser('a.b.c');

      expect(result).toEqual({
        '0': ['a'],
        '1': ['b'],
        '2': ['c'],
      });
    });

    it('should handle asterisks in format', () => {
      const parser = createTokenParser('{0}*{1}');
      const result = parser('left*right');

      expect(result).toEqual({
        '0': ['left'],
        '1': ['right'],
      });
    });

    it('should handle plus signs in format', () => {
      const parser = createTokenParser('{0}+{1}');
      const result = parser('a+b');

      expect(result).toEqual({
        '0': ['a'],
        '1': ['b'],
      });
    });

    it('should handle question marks in format', () => {
      const parser = createTokenParser('{0}?{1}');
      const result = parser('query?param');

      expect(result).toEqual({
        '0': ['query'],
        '1': ['param'],
      });
    });

    it('should handle pipe characters in format', () => {
      const parser = createTokenParser('{0}|{1}');
      const result = parser('left|right');

      expect(result).toEqual({
        '0': ['left'],
        '1': ['right'],
      });
    });

    it('should handle caret in format', () => {
      const parser = createTokenParser('{0}^{1}');
      const result = parser('base^exponent');

      expect(result).toEqual({
        '0': ['base'],
        '1': ['exponent'],
      });
    });

    it('should handle dollar sign in format', () => {
      const parser = createTokenParser('${0}');
      const result = parser('$value');

      expect(result).toEqual({
        '0': ['value'],
      });
    });

    it('should handle values with special characters', () => {
      const parser = createTokenParser('{0}:{1}');
      const result = parser('namespace:resource-name');

      expect(result).toEqual({
        '0': ['namespace'],
        '1': ['resource-name'],
      });
    });

    it('should handle empty token values', () => {
      const parser = createTokenParser('{0}.{1}');
      // With greedy matching, this may not match as expected
      // But the regex uses non-greedy (.+?)
      const result = parser('.');

      // Empty values won't match .+? (requires at least one character)
      expect(result).toEqual({});
    });

    it('should handle format with only separators', () => {
      const parser = createTokenParser('...');
      const result = parser('...');

      expect(result).toEqual({});
    });

    it('should create reusable parser', () => {
      const parser = createTokenParser('{0}/{1}');

      const result1 = parser('a/b');
      const result2 = parser('x/y');

      expect(result1).toEqual({ '0': ['a'], '1': ['b'] });
      expect(result2).toEqual({ '0': ['x'], '1': ['y'] });
    });

    it('should handle format string with backslash', () => {
      const parser = createTokenParser('{0}\\{1}');
      const result = parser('path\\file');

      expect(result).toEqual({
        '0': ['path'],
        '1': ['file'],
      });
    });

    it('should handle URL-like patterns', () => {
      const parser = createTokenParser('https://{0}.example.com/{1}');
      const result = parser('https://subdomain.example.com/path');

      expect(result).toEqual({
        '0': ['subdomain'],
        '1': ['path'],
      });
    });

    it('should handle email-like patterns', () => {
      const parser = createTokenParser('{0}@{1}.{2}');
      const result = parser('user@domain.com');

      expect(result).toEqual({
        '0': ['user'],
        '1': ['domain'],
        '2': ['com'],
      });
    });
  });
});
