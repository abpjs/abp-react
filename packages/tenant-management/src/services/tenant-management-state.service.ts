/**
 * Tenant Management State Service
 * Translated from @abp/ng.tenant-management v1.1.0
 *
 * This service provides state management for tenant management,
 * equivalent to the Angular NGXS TenantManagementState selectors.
 */

import type { ABP } from '@abpjs/core';
import type { TenantManagement } from '../models';

/**
 * State service for managing tenant management state.
 * Provides methods equivalent to Angular's NGXS state selectors.
 *
 * @since 1.1.0
 */
export class TenantManagementStateService {
  private _tenants: ABP.BasicItem[] = [];
  private _totalCount: number = 0;
  private _subscribers: Set<() => void> = new Set();

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
