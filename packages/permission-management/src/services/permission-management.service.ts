import { RestService } from '@abpjs/core';
import { PermissionManagement } from '../models';

/**
 * Service for permission management API calls
 * Translated from @abp/ng.permission-management v0.7.6
 */
export class PermissionManagementService {
  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Get permissions for a provider
   * @param params Provider key and name
   * @returns Promise with permission response
   */
  getPermissions(
    params: PermissionManagement.GetPermissionsParams
  ): Promise<PermissionManagement.Response> {
    return this.rest.request<void, PermissionManagement.Response>({
      method: 'GET',
      url: '/api/permission-management/permissions',
      params,
    });
  }

  /**
   * Update permissions for a provider
   * @param request Update request with permissions, providerKey and providerName
   * @returns Promise that resolves when update completes
   */
  updatePermissions(request: PermissionManagement.UpdateRequest): Promise<void> {
    const { permissions, providerKey, providerName } = request;

    return this.rest.request<{ permissions: PermissionManagement.MinimumPermission[] }, void>({
      method: 'PUT',
      url: '/api/permission-management/permissions',
      body: { permissions },
      params: { providerKey, providerName },
    });
  }
}
