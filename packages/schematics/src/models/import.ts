/**
 * Import Model
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Represents an import statement for code generation.
 */

import { eImportKeyword } from '../enums';
import type { Omissible } from './util';

/**
 * Represents an import statement in generated code.
 */
export class Import {
  alias?: string;
  keyword!: eImportKeyword;
  path!: string;
  refs!: string[];
  specifiers!: string[];

  constructor(options: ImportOptions) {
    this.keyword = eImportKeyword.Default;
    this.refs = [];
    this.specifiers = [];
    Object.assign(this, options);
  }
}

export type ImportOptions = Omissible<Import, 'keyword' | 'refs' | 'specifiers'>;
