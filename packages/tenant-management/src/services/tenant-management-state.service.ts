/**
 * Tenant Management State Service
 * Translated from @abp/ng.tenant-management v4.0.0
 *
 * This service provides state management for tenant management,
 * equivalent to the Angular NGXS TenantManagementState selectors.
 *
 * Changes in v4.0.0:
 * - Now uses TenantService (proxy) instead of TenantManagementService
 * - Uses TenantDto instead of ABP.BasicItem for tenant state
 * - Uses proxy DTOs (TenantCreateDto, TenantUpdateDto) for dispatch methods
 * - Removed updateFromResponse (used deprecated TenantManagement.Response)
 *
 * Changes in v2.0.0:
 * - Added dispatchGetTenants() method
 * - Added dispatchGetTenantById() method
 * - Added dispatchCreateTenant() method
 * - Added dispatchUpdateTenant() method
 * - Added dispatchDeleteTenant() method
 */

import type { PagedResultDto } from '@abpjs/core';
import type { TenantDto, TenantCreateDto, TenantUpdateDto, GetTenantsInput } from '../proxy/models';
import { TenantService } from '../proxy/tenant.service';

/**
 * State service for managing tenant management state.
 * Provides methods equivalent to Angular's NGXS state selectors and dispatch methods.
 *
 * @since 1.1.0
 * @since 4.0.0 - Uses TenantService (proxy) instead of TenantManagementService
 */
export class TenantManagementStateService {
  private _tenants: TenantDto[] = [];
  private _totalCount: number = 0;
  private _subscribers: Set<() => void> = new Set();
  private _tenantService?: TenantService;

  /**
   * Constructor
   * @param tenantService Optional TenantService for dispatch methods (v4.0.0: uses TenantService instead of TenantManagementService)
   */
  constructor(tenantService?: TenantService) {
    this._tenantService = tenantService;
  }

  /**
   * Get all tenants
   * Equivalent to Angular's TenantManagementState selector
   */
  get(): TenantDto[] {
    return [...this._tenants];
  }

  /**
   * Get the total count of tenants
   * @since 1.1.0
   */
  getTenantsTotalCount(): number {
    return this._totalCount;
  }

  /**
   * Set tenants data (called internally by the hook)
   * @internal
   */
  setTenants(tenants: TenantDto[]): void {
    this._tenants = [...tenants];
    this.notifySubscribers();
  }

  /**
   * Set total count (called internally by the hook)
   * @internal
   */
  setTotalCount(count: number): void {
    this._totalCount = count;
    this.notifySubscribers();
  }

  /**
   * Reset the state to initial values
   */
  reset(): void {
    this._tenants = [];
    this._totalCount = 0;
    this.notifySubscribers();
  }

  /**
   * Subscribe to state changes
   * @param callback Function to call when state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: () => void): () => void {
    this._subscribers.add(callback);
    return () => {
      this._subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this._subscribers.forEach((callback) => callback());
  }

  // ========================
  // Dispatch Methods (v2.0.0, updated v4.0.0)
  // ========================

  /**
   * Dispatch GetTenants action - fetches tenants from API and updates state
   * @param input Query parameters for tenant list
   * @returns Promise with the paged tenant result
   * @since 2.0.0
   * @since 4.0.0 - Uses TenantService.getList with GetTenantsInput
   */
  async dispatchGetTenants(input?: Partial<GetTenantsInput>): Promise<PagedResultDto<TenantDto>> {
    if (!this._tenantService) {
      throw new Error(
        'TenantService is required for dispatchGetTenants. Pass it to the constructor.'
      );
    }
    const response = await this._tenantService.getList({
      filter: '',
      maxResultCount: 10,
      skipCount: 0,
      ...input,
    } as GetTenantsInput);
    this._tenants = [...(response.items ?? [])];
    this._totalCount = response.totalCount ?? 0;
    this.notifySubscribers();
    return response;
  }

  /**
   * Dispatch GetTenantById action - fetches a single tenant by ID
   * @param id Tenant ID
   * @returns Promise with the tenant DTO
   * @since 2.0.0
   * @since 4.0.0 - Returns TenantDto instead of TenantManagement.Item
   */
  async dispatchGetTenantById(id: string): Promise<TenantDto> {
    if (!this._tenantService) {
      throw new Error(
        'TenantService is required for dispatchGetTenantById. Pass it to the constructor.'
      );
    }
    return this._tenantService.get(id);
  }

  /**
   * Dispatch CreateTenant action - creates a new tenant and refreshes the list
   * @param input Tenant creation data
   * @returns Promise with the created tenant
   * @since 2.0.0
   * @since 4.0.0 - Uses TenantCreateDto instead of TenantManagement.AddRequest
   */
  async dispatchCreateTenant(input: TenantCreateDto): Promise<TenantDto> {
    if (!this._tenantService) {
      throw new Error(
        'TenantService is required for dispatchCreateTenant. Pass it to the constructor.'
      );
    }
    const result = await this._tenantService.create(input);
    // Refresh the tenant list after creation
    await this.dispatchGetTenants();
    return result;
  }

  /**
   * Dispatch UpdateTenant action - updates an existing tenant and refreshes the list
   * @param id Tenant ID
   * @param input Tenant update data
   * @returns Promise with the updated tenant
   * @since 2.0.0
   * @since 4.0.0 - Uses TenantUpdateDto instead of TenantManagement.UpdateRequest, takes id separately
   */
  async dispatchUpdateTenant(id: string, input: TenantUpdateDto): Promise<TenantDto> {
    if (!this._tenantService) {
      throw new Error(
        'TenantService is required for dispatchUpdateTenant. Pass it to the constructor.'
      );
    }
    const result = await this._tenantService.update(id, input);
    // Refresh the tenant list after update
    await this.dispatchGetTenants();
    return result;
  }

  /**
   * Dispatch DeleteTenant action - deletes a tenant and refreshes the list
   * @param id Tenant ID to delete
   * @returns Promise that resolves when deletion completes
   * @since 2.0.0
   */
  async dispatchDeleteTenant(id: string): Promise<void> {
    if (!this._tenantService) {
      throw new Error(
        'TenantService is required for dispatchDeleteTenant. Pass it to the constructor.'
      );
    }
    await this._tenantService.delete(id);
    // Refresh the tenant list after deletion
    await this.dispatchGetTenants();
  }
}

// Singleton instance
let _stateInstance: TenantManagementStateService | null = null;

/**
 * Get the singleton instance of TenantManagementStateService
 * @since 1.1.0
 */
export function getTenantManagementStateService(): TenantManagementStateService {
  if (!_stateInstance) {
    _stateInstance = new TenantManagementStateService();
  }
  return _stateInstance;
}
