/**
 * Path Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Calculates relative paths between namespaces for import statements.
 */

import { kebab } from './text';

/**
 * Calculates the relative import path to an enum file.
 * @param namespace - The current namespace
 * @param enumNamespace - The enum's namespace
 * @param enumName - The enum name (will be kebab-cased)
 * @returns Relative path like './user-status.enum' or '../shared/user-status.enum'
 */
export function relativePathToEnum(
  namespace: string,
  enumNamespace: string,
  enumName: string
): string {
  const path = calculateRelativePath(namespace, enumNamespace);
  return path + `/${kebab(enumName)}.enum`;
}

/**
 * Calculates the relative import path to a models file.
 * @param namespace - The current namespace
 * @param modelNamespace - The model's namespace
 * @returns Relative path like './models' or '../shared/models'
 */
export function relativePathToModel(namespace: string, modelNamespace: string): string {
  const path = calculateRelativePath(namespace, modelNamespace);
  return path + '/models';
}

/**
 * Calculates the relative path between two namespaces.
 * Uses '../' to navigate up, then descends into the target namespace.
 *
 * @example calculateRelativePath('Users', 'Users') → '.'
 * @example calculateRelativePath('Users', 'Roles') → '../roles'
 * @example calculateRelativePath('Users.Admin', 'Shared.Models') → '../../shared/models'
 */
export function calculateRelativePath(ns1: string, ns2: string): string {
  if (ns1 === ns2) return '.';

  const parts1 = ns1 ? ns1.split('.') : [];
  const parts2 = ns2 ? ns2.split('.') : [];

  while (parts1.length && parts2.length) {
    if (parts1[0] !== parts2[0]) break;
    parts1.shift();
    parts2.shift();
  }

  const up = '../'.repeat(parts1.length) || '.';
  const down = parts2.reduce((acc, p) => acc + '/' + dasherize(p), '');

  return removeTrailingSlash(removeDoubleSlash(up + down));
}

/** Simple dasherize for path segments */
function dasherize(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function removeDoubleSlash(path: string): string {
  return path.replace(/\/{2,}/g, '/');
}

function removeTrailingSlash(path: string): string {
  return path.replace(/\/+$/, '');
}
