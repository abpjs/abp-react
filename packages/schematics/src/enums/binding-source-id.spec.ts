/**
 * eBindingSourceId Tests
 */

import { describe, expect, it } from 'vitest';
import { eBindingSourceId } from './binding-source-id';

describe('eBindingSourceId', () => {
  it('should have Body value', () => {
    expect(eBindingSourceId.Body).toBe('Body');
  });

  it('should have Model value', () => {
    expect(eBindingSourceId.Model).toBe('ModelBinding');
  });

  it('should have Path value', () => {
    expect(eBindingSourceId.Path).toBe('Path');
  });

  it('should have Query value', () => {
    expect(eBindingSourceId.Query).toBe('Query');
  });

  it('should have exactly 4 values', () => {
    const values = Object.values(eBindingSourceId);
    expect(values).toHaveLength(4);
  });
});
