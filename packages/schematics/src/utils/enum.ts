/**
 * Enum Generation Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Converts type definitions with enum metadata into
 * enum descriptor objects for template rendering.
 */

import type { Type } from '../models/api-definition';
import { interpolate } from './common';
import { parseNamespace } from './namespace';
import { Exception } from '../enums';

export interface EnumDescriptor {
  namespace: string;
  name: string;
  members: { key: string; value: number }[];
}

export interface EnumMapperParams {
  solution: string;
  types: Record<string, Type>;
}

/**
 * Checks if an import path is for an enum file.
 */
export function isEnumImport(path: string): boolean {
  return path.endsWith('.enum');
}

/**
 * Extracts enum type references from a service imports map.
 * Filters paths that end with '.enum' and collects all referenced types.
 */
export function getEnumNamesFromImports(serviceImports: Record<string, string[]>): string[] {
  return Object.keys(serviceImports)
    .filter(isEnumImport)
    .reduce<string[]>((acc, path) => {
      serviceImports[path].forEach((_import) => acc.push(_import));
      return acc;
    }, []);
}

/**
 * Creates a mapper that converts a type reference to an enum descriptor
 * containing the namespace, name, and members (key-value pairs).
 */
export function createImportRefToEnumMapper({
  solution,
  types,
}: EnumMapperParams): (ref: string) => EnumDescriptor {
  return (ref: string): EnumDescriptor => {
    const { enumNames, enumValues } = types[ref];

    if (!enumNames || !enumValues) {
      throw new Error(interpolate(Exception.NoTypeDefinition, ref));
    }

    const namespace = parseNamespace(solution, ref);
    const members = enumNames.map((key, i) => ({ key, value: enumValues[i] }));

    return {
      namespace,
      name: ref.split('.').pop()!,
      members,
    };
  };
}
