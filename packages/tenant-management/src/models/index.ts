/**
 * Tenant Management module type definitions
 * Translated from @abp/ng.tenant-management v1.0.0
 */

import type { ABP } from '@abpjs/core';

/**
 * TenantManagement namespace containing all tenant-related types
 */
export namespace TenantManagement {
  /**
   * State interface for tenant management store
   */
  export interface State {
    result: Response;
    selectedItem: Item;
  }

  /**
   * API response for tenant list (paginated)
   */
  export type Response = ABP.PagedResponse<Item>;

  /**
   * Single tenant item
   */
  export interface Item {
    id: string;
    name: string;
  }

  /**
   * Request payload for creating a new tenant
   */
  export interface AddRequest {
    name: string;
  }

  /**
   * Request payload for updating an existing tenant
   */
  export interface UpdateRequest extends AddRequest {
    id: string;
  }

  /**
   * Request payload for updating tenant's default connection string
   */
  export interface DefaultConnectionStringRequest {
    id: string;
    defaultConnectionString: string;
  }
}
