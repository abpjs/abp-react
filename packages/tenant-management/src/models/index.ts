/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Tenant Management module type definitions
 * Translated from @abp/ng.tenant-management v4.0.0
 */

import type { PagedResultDto } from '@abpjs/core';
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

  // ========================
  // Component Interface Types (v2.0.0)
  // ========================

  /**
   * Input props for TenantsComponent
   * @since 2.0.0
   * @since 4.0.0 - Uses TenantDto instead of legacy Item type
   */
  export interface TenantsComponentInputs {
    /** Callback when tenant is created */
    readonly onTenantCreated?: (tenant: TenantDto) => void;
    /** Callback when tenant is updated */
    readonly onTenantUpdated?: (tenant: TenantDto) => void;
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
