/**
 * Tenant Service - Typed proxy service for Tenant Management API
 * Translated from @abp/ng.tenant-management v3.2.0 lib/proxy/tenant.service.d.ts
 *
 * This service provides strongly-typed API methods for tenant management operations.
 * It replaces the legacy TenantManagementService with modern proxy patterns.
 *
 * @since 3.2.0
 */

import { RestService, PagedResultDto } from '@abpjs/core';
import type { GetTenantsInput, TenantCreateDto, TenantDto, TenantUpdateDto } from './models';

/**
 * Typed proxy service for Tenant Management API operations.
 * Provides CRUD operations for tenants with strongly-typed request/response DTOs.
 *
 * @example
 * ```typescript
 * import { TenantService } from '@abpjs/tenant-management';
 * import { getRestService } from '@abpjs/core';
 *
 * const tenantService = new TenantService(getRestService());
 *
 * // Get list of tenants
 * const result = await tenantService.getList({ filter: '', maxResultCount: 10, skipCount: 0 });
 *
 * // Create a new tenant
 * const tenant = await tenantService.create({
 *   name: 'MyTenant',
 *   adminEmailAddress: 'admin@mytenant.com',
 *   adminPassword: 'SecurePassword123!'
 * });
 *
 * // Update a tenant
 * await tenantService.update(tenant.id, { name: 'UpdatedName' });
 *
 * // Delete a tenant
 * await tenantService.delete(tenant.id);
 * ```
 *
 * @since 3.2.0
 */
export class TenantService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   * Defaults to 'default' for the main API.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Create a new tenant.
   * @param input - The tenant creation data including admin credentials
   * @returns Promise resolving to the created tenant DTO
   */
  create = (input: TenantCreateDto): Promise<TenantDto> => {
    return this.restService.request<TenantCreateDto, TenantDto>({
      method: 'POST',
      url: '/api/multi-tenancy/tenants',
      body: input,
    });
  };

  /**
   * Delete a tenant by ID.
   * @param id - The tenant ID to delete
   * @returns Promise resolving when deletion is complete
   */
  delete = (id: string): Promise<void> => {
    return this.restService.request<void, void>({
      method: 'DELETE',
      url: `/api/multi-tenancy/tenants/${id}`,
    });
  };

  /**
   * Delete the default connection string for a tenant.
   * This will cause the tenant to use the shared/host database.
   * @param id - The tenant ID
   * @returns Promise resolving when deletion is complete
   */
  deleteDefaultConnectionString = (id: string): Promise<void> => {
    return this.restService.request<void, void>({
      method: 'DELETE',
      url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
    });
  };

  /**
   * Get a tenant by ID.
   * @param id - The tenant ID
   * @returns Promise resolving to the tenant DTO
   */
  get = (id: string): Promise<TenantDto> => {
    return this.restService.request<void, TenantDto>({
      method: 'GET',
      url: `/api/multi-tenancy/tenants/${id}`,
    });
  };

  /**
   * Get the default connection string for a tenant.
   * @param id - The tenant ID
   * @returns Promise resolving to the connection string (empty if using shared database)
   */
  getDefaultConnectionString = (id: string): Promise<string> => {
    return this.restService.request<void, string>({
      method: 'GET',
      url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
    });
  };

  /**
   * Get a paginated list of tenants.
   * @param input - The query parameters including filter, pagination, and sorting
   * @returns Promise resolving to a paged result of tenant DTOs
   */
  getList = (input: GetTenantsInput): Promise<PagedResultDto<TenantDto>> => {
    return this.restService.request<void, PagedResultDto<TenantDto>>({
      method: 'GET',
      url: '/api/multi-tenancy/tenants',
      params: input as unknown as Record<string, string>,
    });
  };

  /**
   * Update a tenant.
   * @param id - The tenant ID to update
   * @param input - The update data (currently only name can be updated)
   * @returns Promise resolving to the updated tenant DTO
   */
  update = (id: string, input: TenantUpdateDto): Promise<TenantDto> => {
    return this.restService.request<TenantUpdateDto, TenantDto>({
      method: 'PUT',
      url: `/api/multi-tenancy/tenants/${id}`,
      body: input,
    });
  };

  /**
   * Update the default connection string for a tenant.
   * @param id - The tenant ID
   * @param defaultConnectionString - The new connection string
   * @returns Promise resolving when update is complete
   */
  updateDefaultConnectionString = (id: string, defaultConnectionString: string): Promise<void> => {
    return this.restService.request<void, void>({
      method: 'PUT',
      url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
      params: { defaultConnectionString },
    });
  };
}
