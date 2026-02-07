/**
 * Type Adaptation Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import {
  createTypeSimplifier,
  createTypeParser,
  createTypeNormalizer,
  createTypeAdapter,
  flattenDictionaryTypes,
  normalizeTypeAnnotations,
  removeGenerics,
  removeTypeModifiers,
} from '../../utils/type';

describe('Type Utils', () => {
  describe('normalizeTypeAnnotations', () => {
    it('should convert C# array syntax to TypeScript', () => {
      expect(normalizeTypeAnnotations('[string]')).toBe('string[]');
    });

    it('should remove nullable markers', () => {
      expect(normalizeTypeAnnotations('string?')).toBe('string');
    });

    it('should handle both together', () => {
      expect(normalizeTypeAnnotations('[string]?')).toBe('string[]');
    });

    it('should leave plain types unchanged', () => {
      expect(normalizeTypeAnnotations('string')).toBe('string');
    });
  });

  describe('removeGenerics', () => {
    it('should remove generic type args', () => {
      expect(removeGenerics('List<User>')).toBe('List');
    });

    it('should handle nested generics', () => {
      expect(removeGenerics('Dictionary<string, List<User>>')).toBe('Dictionary');
    });

    it('should leave non-generic types unchanged', () => {
      expect(removeGenerics('string')).toBe('string');
    });
  });

  describe('removeTypeModifiers', () => {
    it('should remove array brackets', () => {
      expect(removeTypeModifiers('string[]')).toBe('string');
    });

    it('should handle multiple array modifiers', () => {
      expect(removeTypeModifiers('string[][]')).toBe('string');
    });

    it('should leave non-array types unchanged', () => {
      expect(removeTypeModifiers('string')).toBe('string');
    });
  });

  describe('flattenDictionaryTypes', () => {
    it('should split dictionary notation', () => {
      const result = flattenDictionaryTypes([], '{string:number}');
      expect(result).toEqual(['string', 'number']);
    });

    it('should handle non-dictionary types', () => {
      const result = flattenDictionaryTypes([], 'string');
      expect(result).toEqual(['string']);
    });

    it('should accumulate into existing array', () => {
      const existing = ['boolean'];
      const result = flattenDictionaryTypes(existing, 'string');
      expect(result).toEqual(['boolean', 'string']);
    });
  });

  describe('createTypeNormalizer', () => {
    it('should normalize annotations without replacer', () => {
      const normalize = createTypeNormalizer();
      expect(normalize('[string]?')).toBe('string[]');
    });

    it('should apply replacer after normalization', () => {
      const normalize = createTypeNormalizer((t) => t.toUpperCase());
      expect(normalize('string')).toBe('STRING');
    });
  });

  describe('createTypeParser', () => {
    it('should parse simple types', () => {
      const parse = createTypeParser();
      expect(parse('string')).toEqual(['string']);
    });

    it('should flatten dictionary types', () => {
      const parse = createTypeParser();
      expect(parse('{string:number}')).toEqual(['string', 'number']);
    });

    it('should apply replacer to each segment', () => {
      const parse = createTypeParser((t) => t.toUpperCase());
      expect(parse('string')).toEqual(['STRING']);
    });

    it('should normalize annotations', () => {
      const parse = createTypeParser();
      expect(parse('[string]?')).toEqual(['string[]']);
    });
  });

  describe('createTypeSimplifier', () => {
    const simplify = createTypeSimplifier();

    it('should simplify System.String to string', () => {
      expect(simplify('System.String')).toBe('string');
    });

    it('should simplify System.Int32 to number', () => {
      expect(simplify('System.Int32')).toBe('number');
    });

    it('should simplify System.Boolean to boolean', () => {
      expect(simplify('System.Boolean')).toBe('boolean');
    });

    it('should simplify System.Guid to string', () => {
      expect(simplify('System.Guid')).toBe('string');
    });

    it('should simplify System.Void to void', () => {
      expect(simplify('System.Void')).toBe('void');
    });

    it('should strip namespace from custom types', () => {
      expect(simplify('MyApp.Users.UserDto')).toBe('UserDto');
    });

    it('should handle nullable types', () => {
      expect(simplify('System.String?')).toBe('string');
    });
  });

  describe('createTypeAdapter', () => {
    const adapt = createTypeAdapter();

    it('should adapt simple system types', () => {
      expect(adapt('System.String')).toBe('string');
    });

    it('should adapt custom types', () => {
      expect(adapt('MyApp.Users.UserDto')).toBe('UserDto');
    });
  });
});
