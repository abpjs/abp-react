import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAccountService } from '../../hooks/useAccountService';
import { AccountService } from '../../services/account.service';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
  })),
}));

describe('useAccountService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an AccountService instance', () => {
    const { result } = renderHook(() => useAccountService());

    expect(result.current).toBeInstanceOf(AccountService);
  });

  it('should return consistent AccountService between renders', () => {
    const { result, rerender } = renderHook(() => useAccountService());

    const firstHasMethod = typeof result.current.findTenant === 'function';
    rerender();
    const secondHasMethod = typeof result.current.findTenant === 'function';

    expect(firstHasMethod).toBe(true);
    expect(secondHasMethod).toBe(true);
  });

  it('should have findTenant method', () => {
    const { result } = renderHook(() => useAccountService());

    expect(typeof result.current.findTenant).toBe('function');
  });

  it('should have register method', () => {
    const { result } = renderHook(() => useAccountService());

    expect(typeof result.current.register).toBe('function');
  });
});
