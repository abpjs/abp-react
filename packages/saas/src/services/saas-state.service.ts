/**
 * SaaS State Service
 * Translated from @volo/abp.ng.saas v3.2.0
 *
 * Provides a stateful facade over SaaS operations,
 * maintaining internal state that mirrors the Angular NGXS store pattern.
 *
 * @updated 3.2.0 - Now uses EditionService and TenantService proxy services internally
 */

import type { RestService, PagedResultDto } from '@abpjs/core';
import type { Saas } from '../models';
import { TenantService } from '../proxy/host/tenant.service';
import { EditionService } from '../proxy/host/edition.service';
import type {
  EditionDto,
  SaasTenantDto,
  SaasTenantCreateDto,
  SaasTenantUpdateDto,
  EditionCreateDto,
  EditionUpdateDto,
  GetTenantsInput,
  GetEditionsInput,
} from '../proxy/host/dtos/models';
import type { GetEditionUsageStatisticsResult } from '../proxy/host/models';

/**
 * State service for SaaS operations.
 * Provides dispatch methods that execute API operations and update internal state,
 * mirroring the Angular NGXS store pattern.
 *
 * @since 2.0.0
 * @updated 3.2.0 - Now uses EditionService and TenantService proxy services internally
 *
 * @example
 * ```tsx
 * const stateService = new SaasStateService(restService);
 *
 * // Dispatch to fetch tenants
 * await stateService.dispatchGetTenants({ maxResultCount: 10 });
 *
 * // Access the result
 * const tenants = stateService.getTenants();
 * const total = stateService.getTenantsTotalCount();
 * ```
 */
export class SaasStateService {
  private tenantService: TenantService;
  private editionService: EditionService;
  private state: Saas.State = {
    tenants: { items: [], totalCount: 0 },
    editions: { items: [], totalCount: 0 },
    usageStatistics: {},
    latestTenants: [],
  };

  constructor(rest: RestService) {
    this.tenantService = new TenantService(rest);
    this.editionService = new EditionService(rest);
  }

  // ========================
  // Getter Methods
  // ========================

  /**
   * Get the current list of tenants from state
   * @returns Array of tenants
   */
  getTenants(): SaasTenantDto[] {
    return this.state.tenants?.items ?? [];
  }

  /**
   * Get the latest tenants from state (for dashboard widget)
   * @since 2.0.0
   * @returns Array of latest tenants
   */
  getLatestTenants(): SaasTenantDto[] {
    return this.state.latestTenants ?? [];
  }

  /**
   * Get the total count of tenants from state
   * @returns Total count
   */
  getTenantsTotalCount(): number {
    return this.state.tenants?.totalCount ?? 0;
  }

  /**
   * Get the current list of editions from state
   * @returns Array of editions
   */
  getEditions(): EditionDto[] {
    return this.state.editions?.items ?? [];
  }

  /**
   * Get the total count of editions from state
   * @returns Total count
   */
  getEditionsTotalCount(): number {
    return this.state.editions?.totalCount ?? 0;
  }

  /**
   * Get the usage statistics from state
   * @returns Usage statistics data
   */
  getUsageStatistics(): Record<string, number> {
    return this.state.usageStatistics ?? {};
  }

  // ========================
  // Tenant Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch tenants with optional pagination
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise with the tenants response
   */
  async dispatchGetTenants(params: GetTenantsInput = {}): Promise<PagedResultDto<SaasTenantDto>> {
    const response = await this.tenantService.getList(params);
    this.state = {
      ...this.state,
      tenants: response,
    };
    return response;
  }

  /**
   * Dispatch action to fetch a tenant by ID
   * @param id - The tenant ID
   * @returns Promise with the tenant
   */
  async dispatchGetTenantById(id: string): Promise<SaasTenantDto> {
    const tenant = await this.tenantService.get(id);
    return tenant;
  }

  /**
   * Dispatch action to create a new tenant
   * @param body - The tenant creation request
   * @returns Promise with the created tenant
   */
  async dispatchCreateTenant(body: SaasTenantCreateDto): Promise<SaasTenantDto> {
    const result = await this.tenantService.create(body);
    // Refresh the list after create
    await this.dispatchGetTenants();
    return result;
  }

  /**
   * Dispatch action to update a tenant
   * @param payload - Object containing id and update data
   * @returns Promise with the updated tenant
   */
  async dispatchUpdateTenant(payload: SaasTenantUpdateDto & { id: string }): Promise<SaasTenantDto> {
    const { id, ...input } = payload;
    const result = await this.tenantService.update(id, input);
    // Refresh the list after update
    await this.dispatchGetTenants();
    return result;
  }

  /**
   * Dispatch action to delete a tenant
   * @param id - The tenant ID to delete
   * @returns Promise resolving when complete
   */
  async dispatchDeleteTenant(id: string): Promise<void> {
    await this.tenantService.delete(id);
    // Refresh the list after delete
    await this.dispatchGetTenants();
  }

  /**
   * Dispatch action to fetch the latest tenants (for dashboard widget)
   * @returns Promise with the latest tenants
   * @since 2.0.0
   */
  async dispatchGetLatestTenants(): Promise<PagedResultDto<SaasTenantDto>> {
    const response = await this.tenantService.getList({ maxResultCount: 5, sorting: 'creationTime desc' });
    this.state = {
      ...this.state,
      latestTenants: response.items ?? [],
    };
    return response;
  }

  // ========================
  // Edition Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch editions with optional pagination
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise with the editions response
   */
  async dispatchGetEditions(params: GetEditionsInput = {}): Promise<PagedResultDto<EditionDto>> {
    const response = await this.editionService.getList(params);
    this.state = {
      ...this.state,
      editions: response,
    };
    return response;
  }

  /**
   * Dispatch action to fetch an edition by ID
   * @param id - The edition ID
   * @returns Promise with the edition
   */
  async dispatchGetEditionById(id: string): Promise<EditionDto> {
    const edition = await this.editionService.get(id);
    return edition;
  }

  /**
   * Dispatch action to create a new edition
   * @param body - The edition creation request
   * @returns Promise with the created edition
   */
  async dispatchCreateEdition(body: EditionCreateDto): Promise<EditionDto> {
    const result = await this.editionService.create(body);
    // Refresh the list after create
    await this.dispatchGetEditions();
    return result;
  }

  /**
   * Dispatch action to update an edition
   * @param payload - Object containing id and update data
   * @returns Promise with the updated edition
   */
  async dispatchUpdateEdition(payload: EditionUpdateDto & { id: string }): Promise<EditionDto> {
    const { id, ...input } = payload;
    const result = await this.editionService.update(id, input);
    // Refresh the list after update
    await this.dispatchGetEditions();
    return result;
  }

  /**
   * Dispatch action to delete an edition
   * @param id - The edition ID to delete
   * @returns Promise resolving when complete
   */
  async dispatchDeleteEdition(id: string): Promise<void> {
    await this.editionService.delete(id);
    // Refresh the list after delete
    await this.dispatchGetEditions();
  }

  // ========================
  // Statistics Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch usage statistics
   * @returns Promise with the usage statistics response
   */
  async dispatchGetUsageStatistics(): Promise<GetEditionUsageStatisticsResult> {
    const response = await this.editionService.getUsageStatistics();
    this.state = {
      ...this.state,
      usageStatistics: response.data,
    };
    return response;
  }
}
