/**
 * Tests for audit-logging models
 * @abpjs/audit-logging v4.0.0
 *
 * In v4.0.0, AuditLogging namespace only contains State.
 * All other types (Log, Response, AuditLogsQueryParams, EntityChange, PropertyChange,
 * AuditLogAction) and the Statistics namespace have been removed.
 * Use proxy DTOs from proxy/audit-logging/models instead.
 */
import { describe, it, expect } from 'vitest';
import type { AuditLogging } from '../models';
import type { AuditLogDto } from '../proxy/audit-logging/models';

describe('AuditLogging Models (v4.0.0)', () => {
  describe('AuditLogging.State', () => {
    it('should define State interface correctly', () => {
      const state: AuditLogging.State = {
        result: {
          items: [],
          totalCount: 0,
        },
        averageExecutionStatistics: {},
        errorRateStatistics: {},
      };

      expect(state.result.items).toEqual([]);
      expect(state.result.totalCount).toBe(0);
      expect(state.averageExecutionStatistics).toEqual({});
    });

    it('should use PagedResultDto<AuditLogDto> for result', () => {
      const mockAuditLog: AuditLogDto = {
        id: 'log-1',
        userName: 'admin',
        executionTime: '2024-01-15T10:30:00Z',
        executionDuration: 250,
        clientIpAddress: '192.168.1.1',
        clientName: 'WebClient',
        browserInfo: 'Chrome/120',
        httpMethod: 'POST',
        url: '/api/users',
        exceptions: '',
        comments: '',
        applicationName: 'MyApp',
        correlationId: 'corr-123',
        entityChanges: [],
        actions: [],
      };

      const state: AuditLogging.State = {
        result: {
          items: [mockAuditLog],
          totalCount: 1,
        },
        averageExecutionStatistics: { '2024-01-01': 150 },
        errorRateStatistics: { '2024-01-01': 5 },
      };

      expect(state.result.items).toHaveLength(1);
      expect(state.result.items[0].id).toBe('log-1');
      expect(state.averageExecutionStatistics['2024-01-01']).toBe(150);
      expect(state.errorRateStatistics['2024-01-01']).toBe(5);
    });

    it('should use Record<string, number> for statistics', () => {
      const state: AuditLogging.State = {
        result: { items: [], totalCount: 0 },
        averageExecutionStatistics: {
          '2024-01-01': 100,
          '2024-01-02': 200,
        },
        errorRateStatistics: {
          '2024-01-01': 5,
          '2024-01-02': 3,
        },
      };

      expect(typeof state.averageExecutionStatistics['2024-01-01']).toBe('number');
      expect(typeof state.errorRateStatistics['2024-01-01']).toBe('number');
    });
  });
});
