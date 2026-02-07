import { describe, it, expect } from 'vitest';
import { eTwoFactorBehaviour } from '../../../admin/enums/two-factor-behaviour';

describe('eTwoFactorBehaviour (admin)', () => {
  it('should have Optional = 0', () => {
    expect(eTwoFactorBehaviour.Optional).toBe(0);
  });

  it('should have Disabled = 1', () => {
    expect(eTwoFactorBehaviour.Disabled).toBe(1);
  });

  it('should have Forced = 2', () => {
    expect(eTwoFactorBehaviour.Forced).toBe(2);
  });

  it('should have exactly 3 members', () => {
    // Numeric enums have reverse mappings, so filter by string keys
    const members = Object.keys(eTwoFactorBehaviour).filter(
      (k) => isNaN(Number(k))
    );
    expect(members).toHaveLength(3);
    expect(members).toEqual(
      expect.arrayContaining(['Optional', 'Disabled', 'Forced'])
    );
  });

  it('should support reverse mapping', () => {
    expect(eTwoFactorBehaviour[0]).toBe('Optional');
    expect(eTwoFactorBehaviour[1]).toBe('Disabled');
    expect(eTwoFactorBehaviour[2]).toBe('Forced');
  });
});
