/**
 * Import Utilities
 * Translated from @abp/ng.schematics v3.2.0
 */

import type { Import } from '../models/import';

/**
 * Sorts imports by path (with relative paths first), then by keyword.
 * Mutates the array in place.
 */
export function sortImports(imports: Import[]): void {
  imports.sort((a, b) =>
    removeRelative(a) > removeRelative(b) ? 1 : a.keyword > b.keyword ? 1 : -1
  );
}

/**
 * Strips relative path prefixes for sorting comparison.
 */
function removeRelative(importDef: Import): string {
  return importDef.path.replace(/\.\.\//g, '');
}
