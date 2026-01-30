import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useAccountProService } from '../hooks/useAccountProService';

// Create a mock RestService
const mockRestService = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// Mock the useRestService hook
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
}));

describe('useAccountProService', () => {
  it('should return an AccountProService instance', () => {
    const { result } = renderHook(() => useAccountProService());

    expect(result.current).toBeDefined();
    expect(typeof result.current.findTenant).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.sendPasswordResetCode).toBe('function');
    expect(typeof result.current.resetPassword).toBe('function');
    expect(typeof result.current.changePassword).toBe('function');
    expect(typeof result.current.getProfile).toBe('function');
    expect(typeof result.current.updateProfile).toBe('function');
  });

  it('should memoize the service instance', () => {
    const { result, rerender } = renderHook(() => useAccountProService());
    const firstInstance = result.current;

    rerender();
    const secondInstance = result.current;

    expect(firstInstance).toBe(secondInstance);
  });

  it('should call findTenant with correct parameters', async () => {
    mockRestService.get.mockResolvedValue({ success: true, tenantId: '123' });

    const { result } = renderHook(() => useAccountProService());
    await result.current.findTenant('test-tenant');

    expect(mockRestService.get).toHaveBeenCalledWith(
      '/api/abp/multi-tenancy/tenants/by-name/test-tenant'
    );
  });

  it('should call register with correct parameters', async () => {
    mockRestService.post.mockResolvedValue({ id: '123' });

    const { result } = renderHook(() => useAccountProService());
    const body = { userName: 'test', emailAddress: 'test@test.com', password: 'pass' };
    await result.current.register(body);

    expect(mockRestService.post).toHaveBeenCalledWith(
      '/api/account/register',
      body,
      { skipHandleError: true }
    );
  });

  it('should call sendPasswordResetCode with correct parameters', async () => {
    mockRestService.post.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAccountProService());
    const body = { email: 'test@test.com' };
    await result.current.sendPasswordResetCode(body);

    expect(mockRestService.post).toHaveBeenCalledWith(
      '/api/account/send-password-reset-code',
      body,
      { skipHandleError: true }
    );
  });

  it('should call resetPassword with correct parameters', async () => {
    mockRestService.post.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAccountProService());
    const body = { userId: '123', resetToken: 'token', password: 'newpass' };
    await result.current.resetPassword(body);

    expect(mockRestService.post).toHaveBeenCalledWith(
      '/api/account/reset-password',
      body,
      { skipHandleError: true }
    );
  });

  it('should call changePassword with correct parameters', async () => {
    mockRestService.post.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAccountProService());
    const body = { currentPassword: 'old', newPassword: 'new' };
    await result.current.changePassword(body);

    expect(mockRestService.post).toHaveBeenCalledWith(
      '/api/identity/my-profile/change-password',
      body,
      { skipHandleError: true }
    );
  });

  it('should call getProfile with correct parameters', async () => {
    mockRestService.get.mockResolvedValue({ userName: 'test', email: 'test@test.com' });

    const { result } = renderHook(() => useAccountProService());
    await result.current.getProfile();

    expect(mockRestService.get).toHaveBeenCalledWith('/api/identity/my-profile');
  });

  it('should call updateProfile with correct parameters', async () => {
    mockRestService.put.mockResolvedValue({ userName: 'test', email: 'test@test.com' });

    const { result } = renderHook(() => useAccountProService());
    const body = { userName: 'test', email: 'test@test.com' };
    await result.current.updateProfile(body);

    expect(mockRestService.put).toHaveBeenCalledWith(
      '/api/identity/my-profile',
      body,
      { skipHandleError: true }
    );
  });
});
