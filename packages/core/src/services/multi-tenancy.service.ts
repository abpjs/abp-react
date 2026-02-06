/**
 * MultiTenancyService - Service for multi-tenancy operations
 * Translated from @abp/ng.core v3.1.0
 *
 * @since 3.1.0
 */

import type { ABP } from '../models/common';
import { FindTenantResultDto } from '../models/find-tenant-result-dto';
import type { RestService } from './rest.service';

/**
 * Service for multi-tenancy operations including tenant lookup
 * @since 3.1.0
 */
export class MultiTenancyService {
  private _domainTenant: ABP.BasicItem | null = null;

  /**
   * Whether the tenant selection box is visible
   */
  isTenantBoxVisible = true;

  /**
   * API name for multi-tenancy endpoints
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Set the domain tenant
   */
  set domainTenant(value: ABP.BasicItem | null) {
    this._domainTenant = value;
  }

  /**
   * Get the domain tenant
   */
  get domainTenant(): ABP.BasicItem | null {
    return this._domainTenant;
  }

  /**
   * Find a tenant by name
   * @param name - The tenant name to search for
   * @param headers - Additional headers to send with the request
   * @returns Observable-like promise that resolves to FindTenantResultDto
   * @since 3.1.0
   */
  async findTenantByName(
    name: string,
    headers?: ABP.Dictionary<string>
  ): Promise<FindTenantResultDto> {
    const response = await this.restService.request<FindTenantResultDto>({
      method: 'GET',
      url: `/api/abp/multi-tenancy/tenants/by-name/${name}`,
      headers,
    });

    return new FindTenantResultDto(response);
  }

  /**
   * Find a tenant by ID
   * @param id - The tenant ID to search for
   * @param headers - Additional headers to send with the request
   * @returns Promise that resolves to FindTenantResultDto
   * @since 3.1.0
   */
  async findTenantById(
    id: string,
    headers?: ABP.Dictionary<string>
  ): Promise<FindTenantResultDto> {
    const response = await this.restService.request<FindTenantResultDto>({
      method: 'GET',
      url: `/api/abp/multi-tenancy/tenants/by-id/${id}`,
      headers,
    });

    return new FindTenantResultDto(response);
  }
}
