/**
 * Audit Logs Service (Proxy)
 * Translated from @volo/abp.ng.audit-logging v3.2.0
 *
 * @since 3.2.0 - Added as part of proxy subpackage with typed DTOs
 */

import type { PagedResultDto, RestService } from '@abpjs/core';
import type {
  AuditLogDto,
  EntityChangeDto,
  EntityChangeFilter,
  EntityChangeWithUsernameDto,
  GetAuditLogListDto,
  GetAverageExecutionDurationPerDayInput,
  GetAverageExecutionDurationPerDayOutput,
  GetEntityChangesDto,
  GetErrorRateFilter,
  GetErrorRateOutput,
} from './models';

/**
 * Service for managing audit logs with typed DTOs.
 *
 * @remarks
 * This service is part of the new proxy subpackage introduced in v3.2.0.
 * It provides typed methods for all audit log operations, replacing the
 * older AuditLoggingService which will be deprecated in v4.0.
 *
 * @example
 * ```typescript
 * const service = new AuditLogsService(restService);
 *
 * // Get a single audit log
 * const log = await service.get('log-id');
 *
 * // Get paginated list of audit logs
 * const result = await service.getList({
 *   userName: 'admin',
 *   maxResultCount: 10,
 * });
 * ```
 */
export class AuditLogsService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Get a single audit log by ID.
   * @param id - The ID of the audit log to retrieve
   * @returns The audit log DTO
   */
  get = (id: string): Promise<AuditLogDto> => {
    return this.restService.request<AuditLogDto>({
      method: 'GET',
      url: `/api/audit-logging/audit-logs/${id}`,
    });
  };

  /**
   * Get average execution duration per day statistics.
   * @param filter - Date range filter
   * @returns Statistics with date-to-duration mapping
   */
  getAverageExecutionDurationPerDay = (
    filter: GetAverageExecutionDurationPerDayInput
  ): Promise<GetAverageExecutionDurationPerDayOutput> => {
    return this.restService.request<GetAverageExecutionDurationPerDayOutput>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs/statistics/average-execution-duration-per-day',
      params: filter as unknown as Record<string, unknown>,
    });
  };

  /**
   * Get a single entity change by ID.
   * @param entityChangeId - The ID of the entity change to retrieve
   * @returns The entity change DTO
   */
  getEntityChange = (entityChangeId: string): Promise<EntityChangeDto> => {
    return this.restService.request<EntityChangeDto>({
      method: 'GET',
      url: `/api/audit-logging/audit-logs/entity-changes/${entityChangeId}`,
    });
  };

  /**
   * Get a single entity change with username by ID.
   * @param entityChangeId - The ID of the entity change to retrieve
   * @returns The entity change DTO with username
   */
  getEntityChangeWithUsername = (
    entityChangeId: string
  ): Promise<EntityChangeWithUsernameDto> => {
    return this.restService.request<EntityChangeWithUsernameDto>({
      method: 'GET',
      url: `/api/audit-logging/audit-logs/entity-changes-with-username/${entityChangeId}`,
    });
  };

  /**
   * Get paginated list of entity changes.
   * @param input - Query parameters for filtering and pagination
   * @returns Paginated result of entity changes
   */
  getEntityChanges = (
    input: GetEntityChangesDto
  ): Promise<PagedResultDto<EntityChangeDto>> => {
    return this.restService.request<PagedResultDto<EntityChangeDto>>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs/entity-changes',
      params: input as Record<string, unknown>,
    });
  };

  /**
   * Get entity changes with username for a specific entity.
   * @param input - Entity filter with entityId and entityTypeFullName
   * @returns Array of entity changes with usernames
   */
  getEntityChangesWithUsername = (
    input: EntityChangeFilter
  ): Promise<EntityChangeWithUsernameDto[]> => {
    return this.restService.request<EntityChangeWithUsernameDto[]>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs/entity-changes-with-username',
      params: input as unknown as Record<string, unknown>,
    });
  };

  /**
   * Get error rate statistics.
   * @param filter - Date range filter
   * @returns Statistics with date-to-error-count mapping
   */
  getErrorRate = (filter: GetErrorRateFilter): Promise<GetErrorRateOutput> => {
    return this.restService.request<GetErrorRateOutput>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs/statistics/error-rate',
      params: filter as unknown as Record<string, unknown>,
    });
  };

  /**
   * Get paginated list of audit logs.
   * @param input - Query parameters for filtering and pagination
   * @returns Paginated result of audit logs
   */
  getList = (input?: GetAuditLogListDto): Promise<PagedResultDto<AuditLogDto>> => {
    return this.restService.request<PagedResultDto<AuditLogDto>>({
      method: 'GET',
      url: '/api/audit-logging/audit-logs',
      params: (input ?? {}) as Record<string, unknown>,
    });
  };
}
