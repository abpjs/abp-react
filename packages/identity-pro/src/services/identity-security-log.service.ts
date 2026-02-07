import { RestService, PagedResultDto } from '@abpjs/core';
import type {
  IdentitySecurityLogDto,
  IdentitySecurityLogGetListInput,
} from '../models/identity-security-log';

/**
 * Service for managing identity security log API operations.
 * Provides methods to query security logs for users in the identity module.
 *
 * Security logs track user authentication events such as:
 * - Login succeeded/failed
 * - Logout
 * - Password changes
 * - Two-factor authentication events
 *
 * Translated from @volo/abp.ng.identity IdentitySecurityLogService
 * @since 3.1.0
 */
export class IdentitySecurityLogService {
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
  ): Promise<PagedResultDto<IdentitySecurityLogDto>> {
    return this.rest.request<null, PagedResultDto<IdentitySecurityLogDto>>({
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
  getById(id: string): Promise<IdentitySecurityLogDto> {
    return this.rest.request<null, IdentitySecurityLogDto>({
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
  ): Promise<PagedResultDto<IdentitySecurityLogDto>> {
    return this.rest.request<null, PagedResultDto<IdentitySecurityLogDto>>({
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
  getMyById(id: string): Promise<IdentitySecurityLogDto> {
    return this.rest.request<null, IdentitySecurityLogDto>({
      method: 'GET',
      url: `/api/identity/security-logs/my/${id}`,
    });
  }
}
