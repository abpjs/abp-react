/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Tenant Management module type definitions
 * Translated from @abp/ng.tenant-management v3.2.0
 */

import type { ABP, PagedResultDto } from '@abpjs/core';
import type { TenantDto } from '../proxy/models';

/**
 * TenantManagement namespace containing all tenant-related types
 */
export namespace TenantManagement {
  /**
   * State interface for tenant management store
   * @since 3.2.0 - Uses PagedResultDto<TenantDto> and TenantDto instead of legacy types
   */
  export interface State {
    result: PagedResultDto<TenantDto>;
    selectedItem: TenantDto;
  }

  /**
   * API response for tenant list (paginated)
   * @deprecated To be deleted in v4.0. Use PagedResultDto<TenantDto> from @abpjs/core instead.
   */
  export type Response = ABP.PagedResponse<Item>;

  /**
   * Single tenant item
   * @deprecated To be deleted in v4.0. Use TenantDto from '@abpjs/tenant-management/proxy' instead.
   */
  export interface Item {
    id: string;
    name: string;
  }

  /**
   * Request payload for creating a new tenant
   * @since 2.4.0 Added adminEmailAddress and adminPassword fields
   * @deprecated To be deleted in v4.0. Use TenantCreateDto from '@abpjs/tenant-management/proxy' instead.
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
   * @deprecated To be deleted in v4.0. Use TenantUpdateDto from '@abpjs/tenant-management/proxy' instead.
   */
  export interface UpdateRequest {
    /** Tenant ID */
    id: string;
    /** Tenant name */
    name: string;
  }

  /**
   * Request payload for updating tenant's default connection string
   * @deprecated To be deleted in v4.0. Use TenantService.updateDefaultConnectionString instead.
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
