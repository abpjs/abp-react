/**
 * MultiTenancyService - Service for multi-tenancy operations
 * Translated from @abp/ng.core v4.0.0
 *
 * @since 3.1.0
 * @updated 4.0.0 - domainTenant uses CurrentTenantDto, findTenantByName/findTenantById deprecated
 */

import type { ABP } from '../models/common';
import type {
  CurrentTenantDto,
  FindTenantResultDto,
} from '../models/proxy/multi-tenancy';
import type { RestService } from './rest.service';

/**
 * Service for multi-tenancy operations including tenant lookup
 * @since 3.1.0
 */
export class MultiTenancyService {
  private _domainTenant: CurrentTenantDto | null = null;

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
   * @updated 4.0.0 - Changed from ABP.BasicItem to CurrentTenantDto
   */
  set domainTenant(value: CurrentTenantDto | null) {
    this._domainTenant = value;
  }

  /**
   * Get the domain tenant
   * @updated 4.0.0 - Changed from ABP.BasicItem to CurrentTenantDto
   */
  get domainTenant(): CurrentTenantDto | null {
    return this._domainTenant;
  }

  /**
   * Find a tenant by name
   * @deprecated Use AbpTenantService.findTenantByName method instead. To be deleted in v5.0.
   * @param name - The tenant name to search for
   * @param headers - Additional headers to send with the request
   * @returns Promise that resolves to FindTenantResultDto
   * @since 3.1.0
   */
  async findTenantByName(
    name: string,
    headers?: ABP.Dictionary<string>
  ): Promise<FindTenantResultDto> {
    return this.restService.request<FindTenantResultDto>({
      method: 'GET',
      url: `/api/abp/multi-tenancy/tenants/by-name/${name}`,
      headers,
    });
  }

  /**
   * Find a tenant by ID
   * @deprecated Use AbpTenantService.findTenantById method instead. To be deleted in v5.0.
   * @param id - The tenant ID to search for
   * @param headers - Additional headers to send with the request
   * @returns Promise that resolves to FindTenantResultDto
   * @since 3.1.0
   */
  async findTenantById(
    id: string,
    headers?: ABP.Dictionary<string>
  ): Promise<FindTenantResultDto> {
    return this.restService.request<FindTenantResultDto>({
      method: 'GET',
      url: `/api/abp/multi-tenancy/tenants/by-id/${id}`,
      headers,
    });
  }
}
