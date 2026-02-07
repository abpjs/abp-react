/**
 * eImportKeyword Tests
 */

import { describe, expect, it } from 'vitest';
import { eImportKeyword } from '../../enums/import-keyword';

describe('eImportKeyword', () => {
  it('should have Default value', () => {
    expect(eImportKeyword.Default).toBe('import');
  });

  it('should have Type value', () => {
    expect(eImportKeyword.Type).toBe('import type');
  });

  it('should have exactly 2 values', () => {
    const values = Object.values(eImportKeyword);
    expect(values).toHaveLength(2);
  });
});
