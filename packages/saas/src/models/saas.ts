/**
 * SaaS Models
 * Translated from @volo/abp.ng.saas v2.0.0
 */

import type { ABP } from '@abpjs/core';

/**
 * Saas namespace containing all models for SaaS management
 */
export namespace Saas {
  /**
   * State interface for SaaS
   */
  export interface State {
    tenants: ABP.PagedResponse<Tenant>;
    editions: ABP.PagedResponse<Edition>;
    usageStatistics: Record<string, number>;
    latestTenants: Tenant[];
  }

  /**
   * Tenant interface
   */
  export interface Tenant {
    id: string;
    name: string;
    editionId?: string;
    editionName?: string;
    concurrencyStamp?: string;
  }

  /**
   * Edition interface
   */
  export interface Edition {
    id: string;
    displayName: string;
    concurrencyStamp?: string;
  }

  /**
   * Query parameters for fetching tenants
   */
  export interface TenantsQueryParams extends ABP.PageQueryParams {
    filter?: string;
    editionId?: string;
    getEditionNames?: boolean;
  }

  /**
   * Query parameters for fetching editions
   */
  export interface EditionsQueryParams extends ABP.PageQueryParams {
    filter?: string;
  }

  /**
   * Create tenant request
   */
  export interface CreateTenantRequest {
    name: string;
    editionId?: string;
    adminEmailAddress?: string;
    adminPassword?: string;
  }

  /**
   * Update tenant request
   */
  export interface UpdateTenantRequest {
    id?: string;
    name: string;
    editionId?: string;
    concurrencyStamp?: string;
  }

  /**
   * Create edition request
   */
  export interface CreateEditionRequest {
    displayName: string;
  }

  /**
   * Update edition request
   */
  export interface UpdateEditionRequest {
    id?: string;
    displayName: string;
    concurrencyStamp?: string;
  }

  /**
   * Default connection string request
   */
  export interface DefaultConnectionStringRequest {
    id: string;
    defaultConnectionString: string;
  }

  /**
   * Paginated response for tenants
   */
  export type TenantsResponse = ABP.PagedResponse<Tenant>;

  /**
   * Paginated response for editions
   */
  export type EditionsResponse = ABP.PagedResponse<Edition>;

  /**
   * Usage statistics response
   */
  export interface UsageStatisticsResponse {
    data: Record<string, number>;
  }
}
