/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Tenant Management module type definitions
 * Translated from @abp/ng.tenant-management v2.4.0
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
   * @since 2.4.0 Added adminEmailAddress and adminPassword fields
   */
  export interface AddRequest {
    /** Admin email address for the new tenant */
    adminEmailAddress: string;
    /** Admin password for the new tenant */
    adminPassword: string;
    /** Tenant name */
    name: string;
  }

  /**
   * Request payload for updating an existing tenant
   * @since 2.4.0 No longer extends AddRequest (only id and name needed for update)
   */
  export interface UpdateRequest {
    /** Tenant ID */
    id: string;
    /** Tenant name */
    name: string;
  }

  /**
   * Request payload for updating tenant's default connection string
   */
  export interface DefaultConnectionStringRequest {
    id: string;
    defaultConnectionString: string;
  }

  // ========================
  // Component Interface Types (v2.0.0)
  // ========================

  /**
   * Input props for TenantsComponent
   * @since 2.0.0
   */
  export interface TenantsComponentInputs {
    /** Callback when tenant is created */
    readonly onTenantCreated?: (tenant: Item) => void;
    /** Callback when tenant is updated */
    readonly onTenantUpdated?: (tenant: Item) => void;
    /** Callback when tenant is deleted */
    readonly onTenantDeleted?: (id: string) => void;
  }

  /**
   * Output callbacks for TenantsComponent
   * @since 2.0.0
   */
  export interface TenantsComponentOutputs {
    /** Callback when features modal visibility changes */
    readonly onVisibleFeaturesChange?: (visible: boolean) => void;
    /** Callback when search is performed */
    readonly onSearch?: (value: string) => void;
    /** Callback when page changes */
    readonly onPageChange?: (page: number) => void;
  }
}
