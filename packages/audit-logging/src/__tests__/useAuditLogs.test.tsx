/**
 * Tests for useAuditLogs hook
 * @abpjs/audit-logging v0.7.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuditLogs } from '../hooks';
import type { AuditLogging } from '../models';

// Mock @abpjs/core
const mockRequest = vi.fn();
vi.mock('@abpjs/core', () => ({
  useRestService: () => ({
    request: mockRequest,
  }),
}));

describe('useAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuditLogs());

    expect(result.current.auditLogs).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedLog).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.averageExecutionStats).toEqual({});
    expect(result.current.errorRateStats).toEqual({});
    expect(result.current.sortKey).toBe('executionTime');
    expect(result.current.sortOrder).toBe('desc');
  });

  describe('fetchAuditLogs', () => {
    it('should fetch audit logs successfully', async () => {
      const mockResponse: AuditLogging.Response = {
        items: [
          {
            id: '1',
            userId: 'user1',
            userName: 'admin',
            tenantId: '',
            impersonatorUserId: '',
            impersonatorTenantId: '',
            executionTime: '2024-01-01T00:00:00Z',
            executionDuration: 100,
            clientIpAddress: '127.0.0.1',
            clientName: 'Browser',
            browserInfo: 'Chrome',
            httpMethod: 'GET',
            url: '/api/test',
            exceptions: '',
            comments: '',
            httpStatusCode: 200,
            applicationName: 'TestApp',
            correlationId: 'corr-123',
            extraProperties: {},
            entityChanges: [],
            actions: [],
          },
        ],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.fetchAuditLogs();
        expect(res.success).toBe(true);
        expect(res.data).toEqual(mockResponse);
      });

      expect(result.current.auditLogs).toEqual(mockResponse.items);
      expect(result.current.totalCount).toBe(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.fetchAuditLogs();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Network error');
      });

      expect(result.current.auditLogs).toEqual([]);
      expect(result.current.error).toBe('Network error');
    });

    it('should handle non-Error rejection', async () => {
      mockRequest.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.fetchAuditLogs();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch audit logs');
      });
    });
  });

  describe('getAuditLogById', () => {
    it('should get audit log by ID successfully', async () => {
      const mockLog: AuditLogging.Log = {
        id: '123',
        userId: 'user1',
        userName: 'admin',
        tenantId: '',
        impersonatorUserId: '',
        impersonatorTenantId: '',
        executionTime: '2024-01-01T00:00:00Z',
        executionDuration: 100,
        clientIpAddress: '127.0.0.1',
        clientName: 'Browser',
        browserInfo: 'Chrome',
        httpMethod: 'GET',
        url: '/api/test',
        exceptions: '',
        comments: '',
        httpStatusCode: 200,
        applicationName: 'TestApp',
        correlationId: 'corr-123',
        extraProperties: {},
        entityChanges: [],
        actions: [],
      };
      mockRequest.mockResolvedValueOnce(mockLog);

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.getAuditLogById('123');
        expect(res.success).toBe(true);
        expect(res.data).toEqual(mockLog);
      });

      expect(result.current.selectedLog).toEqual(mockLog);
    });

    it('should handle get by ID error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Not found'));

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.getAuditLogById('invalid-id');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Not found');
      });

      expect(result.current.selectedLog).toBeNull();
    });
  });

  describe('fetchAverageExecutionStats', () => {
    it('should fetch average execution stats successfully', async () => {
      const mockResponse = { data: { '2024-01-01': 100, '2024-01-02': 150 } };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.fetchAverageExecutionStats();
        expect(res.success).toBe(true);
      });

      expect(result.current.averageExecutionStats).toEqual(mockResponse.data);
    });

    it('should handle fetch stats error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Stats error'));

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.fetchAverageExecutionStats();
        expect(res.success).toBe(false);
      });

      expect(result.current.error).toBe('Stats error');
    });
  });

  describe('fetchErrorRateStats', () => {
    it('should fetch error rate stats successfully', async () => {
      const mockResponse = { data: { errors: 10, success: 90 } };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuditLogs());

      await act(async () => {
        const res = await result.current.fetchErrorRateStats();
        expect(res.success).toBe(true);
      });

      expect(result.current.errorRateStats).toEqual(mockResponse.data);
    });
  });

  describe('state setters', () => {
    it('should set selected log', () => {
      const { result } = renderHook(() => useAuditLogs());

      const mockLog: AuditLogging.Log = {
        id: '1',
        userId: 'user1',
        userName: 'admin',
        tenantId: '',
        impersonatorUserId: '',
        impersonatorTenantId: '',
        executionTime: '2024-01-01T00:00:00Z',
        executionDuration: 100,
        clientIpAddress: '127.0.0.1',
        clientName: 'Browser',
        browserInfo: 'Chrome',
        httpMethod: 'GET',
        url: '/api/test',
        exceptions: '',
        comments: '',
        httpStatusCode: 200,
        applicationName: 'TestApp',
        correlationId: 'corr-123',
        extraProperties: {},
        entityChanges: [],
        actions: [],
      };

      act(() => {
        result.current.setSelectedLog(mockLog);
      });

      expect(result.current.selectedLog).toEqual(mockLog);
    });

    it('should set sort key', () => {
      const { result } = renderHook(() => useAuditLogs());

      act(() => {
        result.current.setSortKey('userName');
      });

      expect(result.current.sortKey).toBe('userName');
    });

    it('should set sort order', () => {
      const { result } = renderHook(() => useAuditLogs());

      act(() => {
        result.current.setSortOrder('asc');
      });

      expect(result.current.sortOrder).toBe('asc');
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      const mockResponse: AuditLogging.Response = {
        items: [{ id: '1' } as AuditLogging.Log],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuditLogs());

      // Populate state
      await act(async () => {
        await result.current.fetchAuditLogs();
      });

      expect(result.current.auditLogs.length).toBe(1);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.auditLogs).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedLog).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.sortKey).toBe('executionTime');
      expect(result.current.sortOrder).toBe('desc');
    });
  });
});
