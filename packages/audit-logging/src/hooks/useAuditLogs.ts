/**
 * useAuditLogs Hook
 * Translated from @volo/abp.ng.audit-logging v2.0.0
 */

import { useState, useCallback, useRef } from 'react';
import { useRestService } from '@abpjs/core';
import { AuditLoggingService } from '../services';
import type { AuditLogging, Statistics } from '../models';

/**
 * Result type for async operations
 */
interface AsyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Return type for useAuditLogs hook
 */
export interface UseAuditLogsReturn {
  /** List of audit logs */
  auditLogs: AuditLogging.Log[];
  /** Total count of audit logs */
  totalCount: number;
  /** Currently selected audit log */
  selectedLog: AuditLogging.Log | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Average execution duration statistics */
  averageExecutionStats: Statistics.Data;
  /** Error rate statistics */
  errorRateStats: Statistics.Data;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: '' | 'asc' | 'desc';

  /** Fetch audit logs with query parameters */
  fetchAuditLogs: (params?: AuditLogging.AuditLogsQueryParams) => Promise<AsyncResult<AuditLogging.Response>>;
  /** Get a single audit log by ID */
  getAuditLogById: (id: string) => Promise<AsyncResult<AuditLogging.Log>>;
  /** Fetch average execution duration statistics */
  fetchAverageExecutionStats: (params?: Statistics.Filter) => Promise<AsyncResult<Statistics.Response>>;
  /** Fetch error rate statistics */
  fetchErrorRateStats: (params?: Statistics.Filter) => Promise<AsyncResult<Statistics.Response>>;
  /** Set the selected audit log */
  setSelectedLog: (log: AuditLogging.Log | null) => void;
  /** Set the sort key */
  setSortKey: (key: string) => void;
  /** Set the sort order */
  setSortOrder: (order: '' | 'asc' | 'desc') => void;
  /** Reset all state */
  reset: () => void;
}

/**
 * Hook for managing audit logs
 *
 * @example
 * ```tsx
 * const {
 *   auditLogs,
 *   totalCount,
 *   isLoading,
 *   fetchAuditLogs,
 *   getAuditLogById,
 * } = useAuditLogs();
 *
 * useEffect(() => {
 *   fetchAuditLogs({ maxResultCount: 10 });
 * }, []);
 * ```
 */
export function useAuditLogs(): UseAuditLogsReturn {
  const restService = useRestService();
  const serviceRef = useRef<AuditLoggingService | null>(null);

  // Initialize service lazily
  if (!serviceRef.current) {
    serviceRef.current = new AuditLoggingService(restService);
  }
  const service = serviceRef.current;

  // State
  const [auditLogs, setAuditLogs] = useState<AuditLogging.Log[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLogging.Log | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [averageExecutionStats, setAverageExecutionStats] = useState<Statistics.Data>({});
  const [errorRateStats, setErrorRateStats] = useState<Statistics.Data>({});
  const [sortKey, setSortKey] = useState('executionTime');
  const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>('desc');

  // Store last query params for refresh
  const lastQueryParamsRef = useRef<AuditLogging.AuditLogsQueryParams | undefined>();

  /**
   * Fetch audit logs with query parameters
   */
  const fetchAuditLogs = useCallback(
    async (params?: AuditLogging.AuditLogsQueryParams): Promise<AsyncResult<AuditLogging.Response>> => {
      setIsLoading(true);
      setError(null);
      lastQueryParamsRef.current = params;

      try {
        const response = await service.getAuditLogs(params);
        setAuditLogs(response.items || []);
        setTotalCount(response.totalCount || 0);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit logs';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  /**
   * Get a single audit log by ID
   */
  const getAuditLogById = useCallback(
    async (id: string): Promise<AsyncResult<AuditLogging.Log>> => {
      setIsLoading(true);
      setError(null);

      try {
        const log = await service.getAuditLogById(id);
        setSelectedLog(log);
        return { success: true, data: log };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit log';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  /**
   * Fetch average execution duration statistics
   */
  const fetchAverageExecutionStats = useCallback(
    async (params?: Statistics.Filter): Promise<AsyncResult<Statistics.Response>> => {
      setError(null);

      try {
        const response = await service.getAverageExecutionDurationPerDayStatistics(params);
        setAverageExecutionStats(response.data || {});
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch average execution statistics';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Fetch error rate statistics
   */
  const fetchErrorRateStats = useCallback(
    async (params?: Statistics.Filter): Promise<AsyncResult<Statistics.Response>> => {
      setError(null);

      try {
        const response = await service.getErrorRateStatistics(params);
        setErrorRateStats(response.data || {});
        return { success: true, data: response };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch error rate statistics';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setAuditLogs([]);
    setTotalCount(0);
    setSelectedLog(null);
    setIsLoading(false);
    setError(null);
    setAverageExecutionStats({});
    setErrorRateStats({});
    setSortKey('executionTime');
    setSortOrder('desc');
    lastQueryParamsRef.current = undefined;
  }, []);

  return {
    auditLogs,
    totalCount,
    selectedLog,
    isLoading,
    error,
    averageExecutionStats,
    errorRateStats,
    sortKey,
    sortOrder,
    fetchAuditLogs,
    getAuditLogById,
    fetchAverageExecutionStats,
    fetchErrorRateStats,
    setSelectedLog,
    setSortKey,
    setSortOrder,
    reset,
  };
}
