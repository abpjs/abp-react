import { RestService } from '@abpjs/core';
import type { GetPermissionListResultDto, UpdatePermissionsDto } from './models';

/**
 * Proxy service for permission management API calls
 * Translated from @abp/ng.permission-management v3.2.0
 *
 * This is the new typed proxy service that provides direct API access
 * with properly typed DTOs.
 */
export class PermissionsService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Get permissions for a provider
   * @param providerName Provider name (e.g., 'R' for Role, 'U' for User)
   * @param providerKey Provider key (e.g., role ID or user ID)
   * @returns Promise with permission list result
   */
  get(providerName: string, providerKey: string): Promise<GetPermissionListResultDto> {
    return this.restService.request<void, GetPermissionListResultDto>({
      method: 'GET',
      url: '/api/permission-management/permissions',
      params: { providerName, providerKey },
    });
  }

  /**
   * Update permissions for a provider
   * @param providerName Provider name (e.g., 'R' for Role, 'U' for User)
   * @param providerKey Provider key (e.g., role ID or user ID)
   * @param input Update permissions DTO
   * @returns Promise that resolves when update completes
   */
  update(
    providerName: string,
    providerKey: string,
    input: UpdatePermissionsDto
  ): Promise<void> {
    return this.restService.request<UpdatePermissionsDto, void>({
      method: 'PUT',
      url: '/api/permission-management/permissions',
      body: input,
      params: { providerName, providerKey },
    });
  }
}
