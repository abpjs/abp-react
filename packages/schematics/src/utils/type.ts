/**
 * Type Adaptation Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Core type transformation engine that converts .NET type names
 * to TypeScript equivalents. This is the most complex utility module.
 */

import { SYSTEM_TYPES, VOLO_REGEX } from '../constants';
import { eImportKeyword } from '../enums';
import { Import } from '../models/import';
import { parseGenerics } from './generics';
import { parseNamespace } from './namespace';
import { relativePathToEnum, relativePathToModel } from './path';
import { camel } from './text';

/**
 * Creates a function that simplifies .NET type names to TypeScript.
 * Handles System types, generic types, and namespace stripping.
 *
 * @example
 * const simplify = createTypeSimplifier();
 * simplify('System.String') → 'string'
 * simplify('System.Collections.Generic.List<MyApp.UserDto>') → 'UserDto[]'
 */
export function createTypeSimplifier(): (type: string) => string {
  const parseType = createTypeParser((type: string) => {
    type = type.replace(
      /System\.([0-9A-Za-z.]+)/g,
      (_, match: string) => SYSTEM_TYPES.get(match) ?? camel(match)
    );
    return type.split('.').pop()!;
  });

  return (type: string): string => {
    const parsed = parseType(type);
    const last = parsed.pop()!;
    return parsed.reduceRight((record, tKey) => `Record<${tKey}, ${record}>`, last);
  };
}

/**
 * Creates a type parser that normalizes and transforms type strings.
 *
 * @param replacerFn - Optional function to transform each type segment
 */
export function createTypeParser(
  replacerFn: (t: string) => string = (t) => t
): (originalType: string) => string[] {
  const normalizeType = createTypeNormalizer(replacerFn);
  return (originalType: string): string[] =>
    flattenDictionaryTypes([], originalType).map(normalizeType);
}

/**
 * Creates a function that normalizes type annotations and applies a replacer.
 */
export function createTypeNormalizer(
  replacerFn: (t: string) => string = (t) => t
): (type: string) => string {
  return (type: string): string => {
    type = normalizeTypeAnnotations(type);
    return replacerFn(type);
  };
}

/**
 * Flattens dictionary-style type notation (e.g., `{key:value}`) into an array.
 */
export function flattenDictionaryTypes(types: string[], type: string): string[] {
  type
    .replace(/[}{]/g, '')
    .split(':')
    .forEach((t) => types.push(t));
  return types;
}

/**
 * Normalizes type annotations:
 * - Converts C# array syntax `[T]` to TypeScript `T[]`
 * - Removes nullable markers `?`
 */
export function normalizeTypeAnnotations(type: string): string {
  type = type.replace(/\[(.+)+\]/g, '$1[]');
  return type.replace(/\?/g, '');
}

/**
 * Removes generic type arguments from a type string.
 * @example removeGenerics('List<User>') → 'List'
 */
export function removeGenerics(type: string): string {
  return type.replace(/<.+>/g, '');
}

/**
 * Removes array modifiers from a type string.
 * @example removeTypeModifiers('string[]') → 'string'
 */
export function removeTypeModifiers(type: string): string {
  return type.replace(/\[\]/g, '');
}

/**
 * Creates a reducer that accumulates Import objects from type references.
 * Merges imports for the same path+keyword, deduplicating refs and specifiers.
 *
 * @param solution - The solution root namespace
 * @param namespace - The current file's namespace (for relative path calculation)
 */
export function createTypesToImportsReducer(
  solution: string,
  namespace: string
): (imports: Import[], types: { type: string; isEnum: boolean }[]) => Import[] {
  const mapTypeToImport = createTypeToImportMapper(solution, namespace);

  return (imports: Import[], types: { type: string; isEnum: boolean }[]): Import[] => {
    types.forEach(({ type, isEnum }) => {
      const newImport = mapTypeToImport(type, isEnum);
      if (!newImport) return;

      const existingImport = imports.find(
        ({ keyword, path }) => keyword === newImport.keyword && path === newImport.path
      );

      if (!existingImport) return imports.push(newImport);

      existingImport.refs = [...new Set([...existingImport.refs, ...newImport.refs])];
      existingImport.specifiers = [
        ...new Set([...existingImport.specifiers, ...newImport.specifiers]),
      ].sort();
    });

    return imports;
  };
}

/**
 * Creates a function that maps a single .NET type to an Import object.
 *
 * @param solution - The solution root namespace
 * @param namespace - The current file's namespace
 */
export function createTypeToImportMapper(
  solution: string,
  namespace: string
): (type: string, isEnum: boolean) => Import | undefined {
  const adaptType = createTypeAdapter();
  const simplifyType = createTypeSimplifier();

  return (type: string, isEnum: boolean): Import | undefined => {
    if (!type || type.startsWith('System')) return;

    const modelNamespace = parseNamespace(solution, type);
    const refs = [removeTypeModifiers(type)];
    const specifiers = [adaptType(simplifyType(refs[0]).split('<')[0])];

    const path = VOLO_REGEX.test(type)
      ? '@abpjs/core'
      : isEnum
        ? relativePathToEnum(namespace, modelNamespace, specifiers[0])
        : relativePathToModel(namespace, modelNamespace);

    return new Import({ keyword: eImportKeyword.Type, path, refs, specifiers });
  };
}

/**
 * Creates the main type adapter that converts .NET types to TypeScript.
 * Combines the type simplifier with the generic type tree parser.
 *
 * @example
 * const adapt = createTypeAdapter();
 * adapt('System.String') → 'string'
 * adapt('System.Collections.Generic.List<MyApp.Users.UserDto>') → 'UserDto[]'
 */
export function createTypeAdapter(): (type: string) => string {
  const simplifyType = createTypeSimplifier();
  return (type: string): string =>
    parseGenerics(type, (node) => simplifyType(node.data)).toString();
}
