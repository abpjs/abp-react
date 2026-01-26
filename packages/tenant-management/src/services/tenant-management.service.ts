import { RestService, ABP } from '@abpjs/core';
import { TenantManagement } from '../models';

/**
 * Service for tenant management API calls
 * Translated from @abp/ng.tenant-management v0.9.0
 */
export class TenantManagementService {
  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Get all tenants (paginated)
   * @param params Optional pagination and filter parameters
   * @returns Promise with paginated tenant response
   */
  getAll(params: ABP.PageQueryParams = {}): Promise<TenantManagement.Response> {
    return this.rest.request<null, TenantManagement.Response>({
      method: 'GET',
      url: '/api/multi-tenancy/tenants',
      params,
    });
  }

  /**
   * Get a tenant by ID
   * @param id Tenant ID
   * @returns Promise with tenant item
   */
  getById(id: string): Promise<TenantManagement.Item> {
    return this.rest.request<void, TenantManagement.Item>({
      method: 'GET',
      url: `/api/multi-tenancy/tenants/${id}`,
    });
  }

  /**
   * Create a new tenant
   * @param body Tenant creation request
   * @returns Promise with created tenant item
   */
  create(body: TenantManagement.AddRequest): Promise<TenantManagement.Item> {
    return this.rest.request<TenantManagement.AddRequest, TenantManagement.Item>({
      method: 'POST',
      url: '/api/multi-tenancy/tenants',
      body,
    });
  }

  /**
   * Update an existing tenant
   * @param body Tenant update request (includes id)
   * @returns Promise with updated tenant item
   */
  update(body: TenantManagement.UpdateRequest): Promise<TenantManagement.Item> {
    const { id, ...data } = body;
    return this.rest.request<Omit<TenantManagement.UpdateRequest, 'id'>, TenantManagement.Item>({
      method: 'PUT',
      url: `/api/multi-tenancy/tenants/${id}`,
      body: data,
    });
  }

  /**
   * Delete a tenant
   * @param id Tenant ID
   * @returns Promise that resolves when deletion completes
   */
  delete(id: string): Promise<void> {
    return this.rest.request<void, void>({
      method: 'DELETE',
      url: `/api/multi-tenancy/tenants/${id}`,
    });
  }

  /**
   * Get default connection string for a tenant
   * @param id Tenant ID
   * @returns Promise with connection string (empty string if using shared database)
   */
  getDefaultConnectionString(id: string): Promise<string> {
    return this.rest.request<void, string>({
      method: 'GET',
      url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
    });
  }

  /**
   * Update default connection string for a tenant
   * @param payload Request with tenant ID and connection string
   * @returns Promise that resolves when update completes
   */
  updateDefaultConnectionString(
    payload: TenantManagement.DefaultConnectionStringRequest
  ): Promise<void> {
    const { id, defaultConnectionString } = payload;
    return this.rest.request<void, void>({
      method: 'PUT',
      url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
      params: { defaultConnectionString },
    });
  }

  /**
   * Delete default connection string for a tenant (use shared database)
   * @param id Tenant ID
   * @returns Promise that resolves when deletion completes
   */
  deleteDefaultConnectionString(id: string): Promise<void> {
    return this.rest.request<void, void>({
      method: 'DELETE',
      url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
    });
  }
}
