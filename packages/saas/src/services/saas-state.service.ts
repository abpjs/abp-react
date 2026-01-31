/**
 * SaaS State Service
 * Translated from @volo/abp.ng.saas v2.0.0
 *
 * Provides a stateful facade over SaaS operations,
 * maintaining internal state that mirrors the Angular NGXS store pattern.
 */

import type { RestService } from '@abpjs/core';
import type { Saas } from '../models';
import { SaasService } from './saas.service';

/**
 * State service for SaaS operations.
 * Provides dispatch methods that execute API operations and update internal state,
 * mirroring the Angular NGXS store pattern.
 *
 * @since 2.0.0
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
  private service: SaasService;
  private state: Saas.State = {
    tenants: { items: [], totalCount: 0 },
    editions: { items: [], totalCount: 0 },
    usageStatistics: {},
    latestTenants: [],
  };

  constructor(rest: RestService) {
    this.service = new SaasService(rest);
  }

  // ========================
  // Getter Methods
  // ========================

  /**
   * Get the current list of tenants from state
   */
  getTenants(): Saas.Tenant[] {
    return this.state.tenants?.items ?? [];
  }

  /**
   * Get the latest tenants from state (for dashboard widget)
   * @since 2.0.0
   */
  getLatestTenants(): Saas.Tenant[] {
    return this.state.latestTenants ?? [];
  }

  /**
   * Get the total count of tenants from state
   */
  getTenantsTotalCount(): number {
    return this.state.tenants?.totalCount ?? 0;
  }

  /**
   * Get the current list of editions from state
   */
  getEditions(): Saas.Edition[] {
    return this.state.editions?.items ?? [];
  }

  /**
   * Get the total count of editions from state
   */
  getEditionsTotalCount(): number {
    return this.state.editions?.totalCount ?? 0;
  }

  /**
   * Get the usage statistics from state
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
  async dispatchGetTenants(params: Saas.TenantsQueryParams = {}): Promise<Saas.TenantsResponse> {
    const response = await this.service.getTenants(params);
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
  async dispatchGetTenantById(id: string): Promise<Saas.Tenant> {
    const tenant = await this.service.getTenantById(id);
    return tenant;
  }

  /**
   * Dispatch action to create a new tenant
   * @param body - The tenant creation request
   * @returns Promise with the created tenant
   */
  async dispatchCreateTenant(body: Saas.CreateTenantRequest): Promise<Saas.Tenant> {
    const result = await this.service.createTenant(body);
    // Refresh the list after create
    await this.dispatchGetTenants();
    return result;
  }

  /**
   * Dispatch action to update a tenant
   * @param body - The tenant update request
   * @returns Promise with the updated tenant
   */
  async dispatchUpdateTenant(body: Saas.UpdateTenantRequest): Promise<Saas.Tenant> {
    const result = await this.service.updateTenant(body);
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
    await this.service.deleteTenant(id);
    // Refresh the list after delete
    await this.dispatchGetTenants();
  }

  /**
   * Dispatch action to fetch the latest tenants (for dashboard widget)
   * @returns Promise with the latest tenants
   * @since 2.0.0
   */
  async dispatchGetLatestTenants(): Promise<Saas.Tenant[]> {
    const latestTenants = await this.service.getLatestTenants();
    this.state = {
      ...this.state,
      latestTenants,
    };
    return latestTenants;
  }

  // ========================
  // Edition Dispatch Methods
  // ========================

  /**
   * Dispatch action to fetch editions with optional pagination
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise with the editions response
   */
  async dispatchGetEditions(params: Saas.EditionsQueryParams = {}): Promise<Saas.EditionsResponse> {
    const response = await this.service.getEditions(params);
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
  async dispatchGetEditionById(id: string): Promise<Saas.Edition> {
    const edition = await this.service.getEditionById(id);
    return edition;
  }

  /**
   * Dispatch action to create a new edition
   * @param body - The edition creation request
   * @returns Promise with the created edition
   */
  async dispatchCreateEdition(body: Saas.CreateEditionRequest): Promise<Saas.Edition> {
    const result = await this.service.createEdition(body);
    // Refresh the list after create
    await this.dispatchGetEditions();
    return result;
  }

  /**
   * Dispatch action to update an edition
   * @param body - The edition update request
   * @returns Promise with the updated edition
   */
  async dispatchUpdateEdition(body: Saas.UpdateEditionRequest): Promise<Saas.Edition> {
    const result = await this.service.updateEdition(body);
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
    await this.service.deleteEdition(id);
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
  async dispatchGetUsageStatistics(): Promise<Saas.UsageStatisticsResponse> {
    const response = await this.service.getUsageStatistics();
    this.state = {
      ...this.state,
      usageStatistics: response.data,
    };
    return response;
  }
}
