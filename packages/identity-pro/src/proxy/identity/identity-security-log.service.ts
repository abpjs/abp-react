/**
 * Identity Security Log Service (Proxy)
 * Translated from @volo/abp.ng.identity IdentitySecurityLogService (proxy version)
 * @since 3.2.0
 */
import type { RestService, PagedResultDto } from '@abpjs/core';
import type { GetIdentitySecurityLogListInput, IdentitySecurityLogDto } from './models';

/**
 * Proxy service for querying identity security logs
 * @since 3.2.0
 */
export class IdentitySecurityLogService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Gets a security log by ID
   */
  get(id: string): Promise<IdentitySecurityLogDto> {
    return this.restService.request<unknown, IdentitySecurityLogDto>({
      method: 'GET',
      url: `/api/identity/security-logs/${id}`,
    });
  }

  /**
   * Gets a paginated list of security logs
   */
  getList(input: GetIdentitySecurityLogListInput): Promise<PagedResultDto<IdentitySecurityLogDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentitySecurityLogDto>>({
      method: 'GET',
      url: '/api/identity/security-logs',
      params: {
        startTime: input.startTime,
        endTime: input.endTime,
        applicationName: input.applicationName,
        identity: input.identity,
        action: input.action,
        userName: input.userName,
        clientId: input.clientId,
        correlationId: input.correlationId,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Gets the current user's security log by ID
   */
  getMy(id: string): Promise<IdentitySecurityLogDto> {
    return this.restService.request<unknown, IdentitySecurityLogDto>({
      method: 'GET',
      url: `/api/identity/security-logs/my/${id}`,
    });
  }

  /**
   * Gets a paginated list of the current user's security logs
   */
  getMyList(input: GetIdentitySecurityLogListInput): Promise<PagedResultDto<IdentitySecurityLogDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentitySecurityLogDto>>({
      method: 'GET',
      url: '/api/identity/security-logs/my',
      params: {
        startTime: input.startTime,
        endTime: input.endTime,
        applicationName: input.applicationName,
        identity: input.identity,
        action: input.action,
        userName: input.userName,
        clientId: input.clientId,
        correlationId: input.correlationId,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }
}
