/**
 * Tenant Proxy Service
 * Translated from @volo/abp.ng.saas v3.2.0
 *
 * Provides typed REST API methods for managing tenants.
 *
 * @since 3.2.0
 */

import type { RestService, PagedResultDto } from '@abpjs/core';
import type {
  GetTenantsInput,
  SaasTenantCreateDto,
  SaasTenantDto,
  SaasTenantUpdateDto,
} from './dtos/models';

/**
 * Service for tenant operations with typed DTOs.
 * This is the new proxy service that replaces the tenant-related
 * methods in the legacy SaasService.
 *
 * @since 3.2.0
 */
export class TenantService {
  /**
   * API name for multi-API configurations
   * @since 3.2.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Create a new tenant
   * @param input Tenant creation DTO
   * @returns Promise with created tenant
   */
  async create(input: SaasTenantCreateDto): Promise<SaasTenantDto> {
    return this.restService.request<SaasTenantCreateDto, SaasTenantDto>({
      method: 'POST',
      url: '/api/saas/tenants',
      body: input,
    });
  }

  /**
   * Delete a tenant by ID
   * @param id Tenant ID
   * @returns Promise that resolves when deletion is complete
   */
  async delete(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/saas/tenants/${id}`,
    });
  }

  /**
   * Delete the default connection string for a tenant
   * @param id Tenant ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteDefaultConnectionString(id: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'DELETE',
      url: `/api/saas/tenants/${id}/default-connection-string`,
    });
  }

  /**
   * Get a tenant by ID
   * @param id Tenant ID
   * @returns Promise with tenant data
   */
  async get(id: string): Promise<SaasTenantDto> {
    return this.restService.request<null, SaasTenantDto>({
      method: 'GET',
      url: `/api/saas/tenants/${id}`,
    });
  }

  /**
   * Get the default connection string for a tenant
   * @param id Tenant ID
   * @returns Promise with connection string
   */
  async getDefaultConnectionString(id: string): Promise<string> {
    return this.restService.request<null, string>({
      method: 'GET',
      url: `/api/saas/tenants/${id}/default-connection-string`,
      responseType: 'text',
    });
  }

  /**
   * Get paginated list of tenants
   * @param input Query parameters for filtering and pagination
   * @returns Promise with paginated tenants response
   */
  async getList(input: GetTenantsInput = {}): Promise<PagedResultDto<SaasTenantDto>> {
    return this.restService.request<null, PagedResultDto<SaasTenantDto>>({
      method: 'GET',
      url: '/api/saas/tenants',
      params: input,
    });
  }

  /**
   * Update an existing tenant
   * @param id Tenant ID
   * @param input Tenant update DTO
   * @returns Promise with updated tenant
   */
  async update(id: string, input: SaasTenantUpdateDto): Promise<SaasTenantDto> {
    return this.restService.request<SaasTenantUpdateDto, SaasTenantDto>({
      method: 'PUT',
      url: `/api/saas/tenants/${id}`,
      body: input,
    });
  }

  /**
   * Update the default connection string for a tenant
   * @param id Tenant ID
   * @param defaultConnectionString The connection string
   * @returns Promise that resolves when update is complete
   */
  async updateDefaultConnectionString(id: string, defaultConnectionString: string): Promise<void> {
    return this.restService.request<null, void>({
      method: 'PUT',
      url: `/api/saas/tenants/${id}/default-connection-string`,
      params: { defaultConnectionString },
    });
  }
}
