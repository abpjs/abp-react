/**
 * Identity Security Log Service
 * @since 3.1.0
 * @updated 3.2.0 - New proxy service re-exported, legacy service renamed
 * @updated 4.0.0 - Angular deleted this file; kept for backward compatibility
 * @deprecated To be deleted in v5.0. Import IdentitySecurityLogService from proxy/identity instead
 */
import { RestService, PagedResultDto } from '@abpjs/core';
import type {
  LegacyIdentitySecurityLogDto,
  IdentitySecurityLogGetListInput,
} from '../models/identity-security-log';

// Re-export new proxy service
export { IdentitySecurityLogService } from '../proxy/identity/identity-security-log.service';

/**
 * Legacy service for managing identity security log API operations.
 * @deprecated Use IdentitySecurityLogService from proxy/identity instead
 * @since 3.1.0
 */
export class LegacyIdentitySecurityLogService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Get security logs with filtering and pagination.
   * Requires AbpIdentity.SecurityLogs permission.
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated security logs
   */
  getListByInput(
    params: Partial<IdentitySecurityLogGetListInput> = {}
  ): Promise<PagedResultDto<LegacyIdentitySecurityLogDto>> {
    return this.rest.request<null, PagedResultDto<LegacyIdentitySecurityLogDto>>({
      method: 'GET',
      url: '/api/identity/security-logs',
      params,
    });
  }

  /**
   * Get a single security log by ID.
   * Requires AbpIdentity.SecurityLogs permission.
   * @param id - The security log ID
   * @returns Promise with the security log details
   */
  getById(id: string): Promise<LegacyIdentitySecurityLogDto> {
    return this.rest.request<null, LegacyIdentitySecurityLogDto>({
      method: 'GET',
      url: `/api/identity/security-logs/${id}`,
    });
  }

  /**
   * Get security logs for the current user.
   * This method allows users to view their own security logs without
   * requiring the full AbpIdentity.SecurityLogs permission.
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated security logs for current user
   */
  getMyListByInput(
    params: Partial<IdentitySecurityLogGetListInput> = {}
  ): Promise<PagedResultDto<LegacyIdentitySecurityLogDto>> {
    return this.rest.request<null, PagedResultDto<LegacyIdentitySecurityLogDto>>({
      method: 'GET',
      url: '/api/identity/security-logs/my',
      params,
    });
  }

  /**
   * Get a single security log by ID for the current user.
   * This method allows users to view details of their own security logs.
   * @param id - The security log ID
   * @returns Promise with the security log details
   */
  getMyById(id: string): Promise<LegacyIdentitySecurityLogDto> {
    return this.rest.request<null, LegacyIdentitySecurityLogDto>({
      method: 'GET',
      url: `/api/identity/security-logs/my/${id}`,
    });
  }
}
