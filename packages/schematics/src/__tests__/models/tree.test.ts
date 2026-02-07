/**
 * Tree Types Tests
 */

import { describe, expect, it } from 'vitest';
import type { WriteOp } from '../../models/tree';

describe('WriteOp', () => {
  it('should accept create value', () => {
    const op: WriteOp = 'create';
    expect(op).toBe('create');
  });

  it('should accept overwrite value', () => {
    const op: WriteOp = 'overwrite';
    expect(op).toBe('overwrite');
  });
});
