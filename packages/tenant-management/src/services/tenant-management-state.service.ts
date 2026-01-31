/**
 * Tenant Management State Service
 * Translated from @abp/ng.tenant-management v2.0.0
 *
 * This service provides state management for tenant management,
 * equivalent to the Angular NGXS TenantManagementState selectors.
 *
 * Changes in v2.0.0:
 * - Added dispatchGetTenants() method
 * - Added dispatchGetTenantById() method
 * - Added dispatchCreateTenant() method
 * - Added dispatchUpdateTenant() method
 * - Added dispatchDeleteTenant() method
 */

import type { ABP } from '@abpjs/core';
import type { TenantManagement } from '../models';
import { TenantManagementService } from './tenant-management.service';

/**
 * State service for managing tenant management state.
 * Provides methods equivalent to Angular's NGXS state selectors and dispatch methods.
 *
 * @since 1.1.0
 */
export class TenantManagementStateService {
  private _tenants: ABP.BasicItem[] = [];
  private _totalCount: number = 0;
  private _subscribers: Set<() => void> = new Set();
  private _tenantService?: TenantManagementService;

  /**
   * Constructor
   * @param tenantService Optional TenantManagementService for dispatch methods (v2.0.0)
   */
  constructor(tenantService?: TenantManagementService) {
    this._tenantService = tenantService;
  }

  /**
   * Get all tenants
   * Equivalent to Angular's TenantManagementState selector
   */
  get(): ABP.BasicItem[] {
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
  setTenants(tenants: ABP.BasicItem[]): void {
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
   * Update state from a response
   * @internal
   */
  updateFromResponse(response: TenantManagement.Response): void {
    this._tenants = [...response.items];
    this._totalCount = response.totalCount;
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
  // Dispatch Methods (v2.0.0)
  // ========================

  /**
   * Dispatch GetTenants action - fetches tenants from API and updates state
   * @param params Optional pagination parameters
   * @returns Promise with the tenant response
   * @since 2.0.0
   */
  async dispatchGetTenants(params?: ABP.PageQueryParams): Promise<TenantManagement.Response> {
    if (!this._tenantService) {
      throw new Error(
        'TenantManagementService is required for dispatchGetTenants. Pass it to the constructor.'
      );
    }
    const response = await this._tenantService.getAll(params);
    this.updateFromResponse(response);
    return response;
  }

  /**
   * Dispatch GetTenantById action - fetches a single tenant by ID
   * @param id Tenant ID
   * @returns Promise with the tenant item
   * @since 2.0.0
   */
  async dispatchGetTenantById(id: string): Promise<TenantManagement.Item> {
    if (!this._tenantService) {
      throw new Error(
        'TenantManagementService is required for dispatchGetTenantById. Pass it to the constructor.'
      );
    }
    return this._tenantService.getById(id);
  }

  /**
   * Dispatch CreateTenant action - creates a new tenant and refreshes the list
   * @param body Tenant creation request
   * @returns Promise with the created tenant
   * @since 2.0.0
   */
  async dispatchCreateTenant(body: TenantManagement.AddRequest): Promise<TenantManagement.Item> {
    if (!this._tenantService) {
      throw new Error(
        'TenantManagementService is required for dispatchCreateTenant. Pass it to the constructor.'
      );
    }
    const result = await this._tenantService.create(body);
    // Refresh the tenant list after creation
    await this.dispatchGetTenants();
    return result;
  }

  /**
   * Dispatch UpdateTenant action - updates an existing tenant and refreshes the list
   * @param body Tenant update request
   * @returns Promise with the updated tenant
   * @since 2.0.0
   */
  async dispatchUpdateTenant(body: TenantManagement.UpdateRequest): Promise<TenantManagement.Item> {
    if (!this._tenantService) {
      throw new Error(
        'TenantManagementService is required for dispatchUpdateTenant. Pass it to the constructor.'
      );
    }
    const result = await this._tenantService.update(body);
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
        'TenantManagementService is required for dispatchDeleteTenant. Pass it to the constructor.'
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
