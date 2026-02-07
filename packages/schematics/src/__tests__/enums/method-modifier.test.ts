/**
 * eMethodModifier Tests
 */

import { describe, expect, it } from 'vitest';
import { eMethodModifier } from '../../enums/method-modifier';

describe('eMethodModifier', () => {
  it('should have Public value (empty string for no modifier)', () => {
    expect(eMethodModifier.Public).toBe('');
  });

  it('should have Private value', () => {
    expect(eMethodModifier.Private).toBe('private ');
  });

  it('should have Async value', () => {
    expect(eMethodModifier.Async).toBe('async ');
  });

  it('should have PrivateAsync value', () => {
    expect(eMethodModifier.PrivateAsync).toBe('private async ');
  });

  it('should have exactly 4 values', () => {
    const values = Object.values(eMethodModifier);
    expect(values).toHaveLength(4);
  });
});
