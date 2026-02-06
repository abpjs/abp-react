/* eslint-disable @typescript-eslint/no-namespace */
/**
 * SaaS Models
 * Translated from @volo/abp.ng.saas v2.4.0
 *
 * @updated 2.4.0 - Updated CreateTenantRequest and UpdateTenantRequest types
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
   * @updated 2.4.0 - adminEmailAddress and adminPassword are now required
   */
  export interface CreateTenantRequest {
    adminEmailAddress: string;
    adminPassword: string;
    name: string;
    editionId?: string;
  }

  /**
   * Update tenant request
   * @updated 2.4.0 - Now uses Omit<Tenant, 'editionName'> pattern
   */
  export type UpdateTenantRequest = Omit<Tenant, 'editionName'>;

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
