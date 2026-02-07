/**
 * Import Utilities Tests
 */

import { describe, expect, it } from 'vitest';
import { sortImports } from '../../utils/import';
import { Import } from '../../models/import';
import { eImportKeyword } from '../../enums';

describe('Import Utils', () => {
  describe('sortImports', () => {
    it('should sort by path alphabetically after stripping relative prefixes', () => {
      const imports = [
        new Import({ keyword: eImportKeyword.Type, path: './models', specifiers: ['User'] }),
        new Import({ keyword: eImportKeyword.Default, path: '@abpjs/core', specifiers: ['RestService'] }),
      ];

      sortImports(imports);

      // Relative paths (./models) sort before package paths (@abpjs/core) in ASCII
      expect(imports[0].path).toBe('./models');
      expect(imports[1].path).toBe('@abpjs/core');
    });

    it('should sort relative paths considering depth', () => {
      const imports = [
        new Import({ keyword: eImportKeyword.Type, path: '../../shared/models', specifiers: ['A'] }),
        new Import({ keyword: eImportKeyword.Type, path: './models', specifiers: ['B'] }),
        new Import({ keyword: eImportKeyword.Type, path: '../users/models', specifiers: ['C'] }),
      ];

      sortImports(imports);

      expect(imports[0].path).toBe('./models');
      expect(imports[1].path).toBe('../../shared/models');
    });

    it('should sort by keyword when paths match', () => {
      const imports = [
        new Import({ keyword: eImportKeyword.Type, path: './models', specifiers: ['A'] }),
        new Import({ keyword: eImportKeyword.Default, path: './models', specifiers: ['B'] }),
      ];

      sortImports(imports);

      expect(imports[0].keyword).toBe(eImportKeyword.Default);
      expect(imports[1].keyword).toBe(eImportKeyword.Type);
    });

    it('should handle empty array', () => {
      const imports: Import[] = [];
      sortImports(imports);
      expect(imports).toEqual([]);
    });
  });
});
