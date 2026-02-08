/**
 * useAuditLogs Hook
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * @since 4.0.0 - Updated to use AuditLogsService and proxy DTOs
 */

import { useState, useCallback, useRef } from 'react';
import { useRestService } from '@abpjs/core';
import type { PagedResultDto } from '@abpjs/core';
import { AuditLogsService } from '../proxy/audit-logging/audit-logs.service';
import type {
  AuditLogDto,
  GetAuditLogListDto,
  GetAverageExecutionDurationPerDayInput,
  GetAverageExecutionDurationPerDayOutput,
  GetErrorRateFilter,
  GetErrorRateOutput,
} from '../proxy/audit-logging/models';

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
  auditLogs: AuditLogDto[];
  /** Total count of audit logs */
  totalCount: number;
  /** Currently selected audit log */
  selectedLog: AuditLogDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Average execution duration statistics */
  averageExecutionStats: Record<string, number>;
  /** Error rate statistics */
  errorRateStats: Record<string, number>;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: '' | 'asc' | 'desc';

  /** Fetch audit logs with query parameters */
  fetchAuditLogs: (params?: GetAuditLogListDto) => Promise<AsyncResult<PagedResultDto<AuditLogDto>>>;
  /** Get a single audit log by ID */
  getAuditLogById: (id: string) => Promise<AsyncResult<AuditLogDto>>;
  /** Fetch average execution duration statistics */
  fetchAverageExecutionStats: (params: GetAverageExecutionDurationPerDayInput) => Promise<AsyncResult<GetAverageExecutionDurationPerDayOutput>>;
  /** Fetch error rate statistics */
  fetchErrorRateStats: (params: GetErrorRateFilter) => Promise<AsyncResult<GetErrorRateOutput>>;
  /** Set the selected audit log */
  setSelectedLog: (log: AuditLogDto | null) => void;
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
  const serviceRef = useRef<AuditLogsService | null>(null);

  // Initialize service lazily
  if (!serviceRef.current) {
    serviceRef.current = new AuditLogsService(restService);
  }
  const service = serviceRef.current;

  // State
  const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLogDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [averageExecutionStats, setAverageExecutionStats] = useState<Record<string, number>>({});
  const [errorRateStats, setErrorRateStats] = useState<Record<string, number>>({});
  const [sortKey, setSortKey] = useState('executionTime');
  const [sortOrder, setSortOrder] = useState<'' | 'asc' | 'desc'>('desc');

  // Store last query params for refresh
  const lastQueryParamsRef = useRef<GetAuditLogListDto | undefined>();

  /**
   * Fetch audit logs with query parameters
   */
  const fetchAuditLogs = useCallback(
    async (params?: GetAuditLogListDto): Promise<AsyncResult<PagedResultDto<AuditLogDto>>> => {
      setIsLoading(true);
      setError(null);
      lastQueryParamsRef.current = params;

      try {
        const response = await service.getList(params);
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
    async (id: string): Promise<AsyncResult<AuditLogDto>> => {
      setIsLoading(true);
      setError(null);

      try {
        const log = await service.get(id);
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
    async (params: GetAverageExecutionDurationPerDayInput): Promise<AsyncResult<GetAverageExecutionDurationPerDayOutput>> => {
      setError(null);

      try {
        const response = await service.getAverageExecutionDurationPerDay(params);
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
    async (params: GetErrorRateFilter): Promise<AsyncResult<GetErrorRateOutput>> => {
      setError(null);

      try {
        const response = await service.getErrorRate(params);
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
