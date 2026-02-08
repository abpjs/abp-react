/**
 * SaaS Service
 * Translated from @volo/abp.ng.saas v2.0.0
 *
 * Provides REST API methods for managing tenants, editions,
 * and connection strings in a multi-tenant SaaS application.
 *
 * @deprecated To be deleted in v5.0. Use proxy services (TenantService, EditionService) instead.
 * This service was deleted in the Angular source at v4.0.0.
 */

import type { RestService } from '@abpjs/core';
import type { Saas } from '../models';

/**
 * Service for SaaS operations including tenant and edition management.
 * This service wraps all REST API calls for the SaaS module.
 *
 * @since 2.0.0
 * @updated 2.4.0 - Added apiName property
 * @deprecated To be deleted in v5.0. Use proxy services (TenantService, EditionService) instead.
 */
export class SaasService {
  /**
   * API name for multi-API configurations
   * @since 2.4.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  // ==================== Tenant Operations ====================

  /**
   * Get paginated list of tenants
   * @param params Query parameters for filtering and pagination
   * @returns Promise with paginated tenant response
   */
  async getTenants(params: Saas.TenantsQueryParams = {}): Promise<Saas.TenantsResponse> {
    return this.restService.request<null, Saas.TenantsResponse>({
      method: 'GET',
      url: '/api/saas/tenants',
      params,
    });
  }

  /**
   * Get a tenant by ID
   * @param id Tenant ID
   * @returns Promise with tenant data
   */
  async getTenantById(id: string): Promise<Saas.Tenant> {
    return this.restService.request<null, Saas.Tenant>({
      method: 'GET',
      url: `/api/saas/tenants/${id}`,
    });
  }

  /**
   * Create a new tenant
   * @param body Tenant creation request
   * @returns Promise with created tenant data
   */
  async createTenant(body: Saas.CreateTenantRequest): Promise<Saas.Tenant> {
    return this.restService.request<Saas.CreateTenantRequest, Saas.Tenant>({
      method: 'POST',
      url: '/api/saas/tenants',
      body,
    });
  }

  /**
   * Update an existing tenant
   * @param body Tenant update request (must include id)
   * @returns Promise with updated tenant data
   */
  async updateTenant(body: Saas.UpdateTenantRequest): Promise<Saas.Tenant> {
    const { id, ...rest } = body;
    return this.restService.request<Omit<Saas.UpdateTenantRequest, 'id'>, Saas.Tenant>({
      method: 'PUT',
      url: `/api/saas/tenants/${id}`,
      body: rest,
    });
  }

  /**
   * Delete a tenant by ID
   * @param id Tenant ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  async deleteTenant(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/saas/tenants/${id}`,
    });
  }

  // ==================== Connection String Operations ====================

  /**
   * Get the default connection string for a tenant
   * @param id Tenant ID
   * @returns Promise with connection string (empty string if using shared database)
   */
  async getDefaultConnectionString(id: string): Promise<string> {
    return this.restService.request<null, string>({
      method: 'GET',
      url: `/api/saas/tenants/${id}/default-connection-string`,
      responseType: 'text',
    });
  }

  /**
   * Update the default connection string for a tenant
   * @param payload Object containing tenant ID and connection string
   * @returns Promise that resolves when update is complete
   */
  async updateDefaultConnectionString(payload: Saas.DefaultConnectionStringRequest): Promise<void> {
    return this.restService.request<null, void>({
      method: 'PUT',
      url: `/api/saas/tenants/${payload.id}/default-connection-string`,
      params: { defaultConnectionString: payload.defaultConnectionString },
    });
  }

  /**
   * Delete the default connection string for a tenant (revert to shared database)
   * @param id Tenant ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteDefaultConnectionString(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/saas/tenants/${id}/default-connection-string`,
    });
  }

  // ==================== Edition Operations ====================

  /**
   * Get paginated list of editions
   * @param params Query parameters for filtering and pagination
   * @returns Promise with paginated editions response
   */
  async getEditions(params: Saas.EditionsQueryParams = {}): Promise<Saas.EditionsResponse> {
    return this.restService.request<null, Saas.EditionsResponse>({
      method: 'GET',
      url: '/api/saas/editions',
      params,
    });
  }

  /**
   * Get an edition by ID
   * @param id Edition ID
   * @returns Promise with edition data
   */
  async getEditionById(id: string): Promise<Saas.Edition> {
    return this.restService.request<null, Saas.Edition>({
      method: 'GET',
      url: `/api/saas/editions/${id}`,
    });
  }

  /**
   * Create a new edition
   * @param body Edition creation request
   * @returns Promise with created edition data
   */
  async createEdition(body: Saas.CreateEditionRequest): Promise<Saas.Edition> {
    return this.restService.request<Saas.CreateEditionRequest, Saas.Edition>({
      method: 'POST',
      url: '/api/saas/editions',
      body,
    });
  }

  /**
   * Update an existing edition
   * @param body Edition update request (must include id)
   * @returns Promise with updated edition data
   */
  async updateEdition(body: Saas.UpdateEditionRequest): Promise<Saas.Edition> {
    const { id, ...rest } = body;
    return this.restService.request<Omit<Saas.UpdateEditionRequest, 'id'>, Saas.Edition>({
      method: 'PUT',
      url: `/api/saas/editions/${id}`,
      body: rest,
    });
  }

  /**
   * Delete an edition by ID
   * @param id Edition ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  async deleteEdition(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/saas/editions/${id}`,
    });
  }

  // ==================== Statistics Operations ====================

  /**
   * Get usage statistics for editions
   * @returns Promise with usage statistics data
   */
  async getUsageStatistics(): Promise<Saas.UsageStatisticsResponse> {
    return this.restService.request<null, Saas.UsageStatisticsResponse>({
      method: 'GET',
      url: '/api/saas/editions/statistics/usage-statistic',
    });
  }

  /**
   * Get the latest tenants (for dashboard widget)
   * @returns Promise with array of latest tenants
   * @since 2.0.0
   */
  async getLatestTenants(): Promise<Saas.Tenant[]> {
    return this.restService.request<null, Saas.Tenant[]>({
      method: 'GET',
      url: '/api/saas/tenants/latest',
    });
  }
}
