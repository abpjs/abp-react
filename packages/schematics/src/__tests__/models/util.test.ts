/**
 * Util Types Tests
 */

import { describe, expect, it } from 'vitest';
import type { Omissible } from '../../models/util';

describe('Omissible', () => {
  interface TestInterface {
    required1: string;
    required2: number;
    optional1: boolean;
    optional2: string[];
  }

  it('should make specified keys optional', () => {
    // This type should have optional1 and optional2 as optional
    type TestOmissible = Omissible<TestInterface, 'optional1' | 'optional2'>;

    // Valid - all required fields provided, optional fields omitted
    const valid1: TestOmissible = {
      required1: 'test',
      required2: 42,
    };
    expect(valid1.required1).toBe('test');
    expect(valid1.required2).toBe(42);

    // Valid - all fields provided
    const valid2: TestOmissible = {
      required1: 'test',
      required2: 42,
      optional1: true,
      optional2: ['a', 'b'],
    };
    expect(valid2.optional1).toBe(true);
    expect(valid2.optional2).toEqual(['a', 'b']);
  });

  it('should work with single key', () => {
    type SingleOmissible = Omissible<TestInterface, 'optional1'>;

    const valid: SingleOmissible = {
      required1: 'test',
      required2: 42,
      optional2: [],
    };
    expect(valid.optional2).toEqual([]);
  });
});
