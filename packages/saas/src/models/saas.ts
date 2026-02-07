/* eslint-disable @typescript-eslint/no-namespace */
/**
 * SaaS Models
 * Translated from @volo/abp.ng.saas v3.2.0
 *
 * @updated 2.4.0 - Updated CreateTenantRequest and UpdateTenantRequest types
 * @updated 3.2.0 - Added deprecation notices for legacy types, state now uses proxy DTOs
 */

import type { PagedResultDto } from '@abpjs/core';
import type { EditionDto, SaasTenantDto } from '../proxy/host/dtos/models';

/**
 * Saas namespace containing all models for SaaS management
 *
 * @deprecated The types in this namespace are deprecated in favor of the proxy DTOs.
 * Use the following instead:
 * - `SaasTenantDto` instead of `Saas.Tenant`
 * - `EditionDto` instead of `Saas.Edition`
 * - `SaasTenantCreateDto` instead of `Saas.CreateTenantRequest`
 * - `SaasTenantUpdateDto` instead of `Saas.UpdateTenantRequest`
 * - `EditionCreateDto` instead of `Saas.CreateEditionRequest`
 * - `EditionUpdateDto` instead of `Saas.UpdateEditionRequest`
 *
 * These legacy types will be removed in v4.0.0.
 */
export namespace Saas {
  /**
   * State interface for SaaS
   * @updated 3.2.0 - Now uses proxy DTOs (PagedResultDto<SaasTenantDto>, PagedResultDto<EditionDto>)
   */
  export interface State {
    tenants: PagedResultDto<SaasTenantDto>;
    editions: PagedResultDto<EditionDto>;
    usageStatistics: Record<string, number>;
    latestTenants: SaasTenantDto[];
  }

  /**
   * Tenant response type alias
   * @deprecated Use PagedResultDto<SaasTenantDto> instead. To be removed in v4.0.
   */
  export type TenantResponse = PagedResultDto<Tenant>;

  /**
   * Edition response type alias
   * @deprecated Use PagedResultDto<EditionDto> instead. To be removed in v4.0.
   */
  export type EditionResponse = PagedResultDto<Edition>;

  /**
   * Tenant interface
   * @deprecated Use SaasTenantDto from proxy/host/dtos instead. To be removed in v4.0.
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
   * @deprecated Use EditionDto from proxy/host/dtos instead. To be removed in v4.0.
   */
  export interface Edition {
    id: string;
    displayName: string;
    concurrencyStamp?: string;
  }

  /**
   * Query parameters for fetching tenants
   * @deprecated Use GetTenantsInput from proxy/host/dtos instead. To be removed in v4.0.
   */
  export interface TenantsQueryParams {
    filter?: string;
    editionId?: string;
    getEditionNames?: boolean;
    skipCount?: number;
    maxResultCount?: number;
    sorting?: string;
  }

  /**
   * Query parameters for fetching editions
   * @deprecated Use GetEditionsInput from proxy/host/dtos instead. To be removed in v4.0.
   */
  export interface EditionsQueryParams {
    filter?: string;
    skipCount?: number;
    maxResultCount?: number;
    sorting?: string;
  }

  /**
   * Create tenant request
   * @deprecated Use SaasTenantCreateDto from proxy/host/dtos instead. To be removed in v4.0.
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
   * @deprecated Use SaasTenantUpdateDto from proxy/host/dtos instead. To be removed in v4.0.
   * @updated 2.4.0 - Now uses Omit<Tenant, 'editionName'> pattern
   */
  export type UpdateTenantRequest = Omit<Tenant, 'editionName'>;

  /**
   * Create edition request
   * @deprecated Use EditionCreateDto from proxy/host/dtos instead. To be removed in v4.0.
   */
  export interface CreateEditionRequest {
    displayName: string;
  }

  /**
   * Update edition request
   * @deprecated Use EditionUpdateDto from proxy/host/dtos instead. To be removed in v4.0.
   */
  export interface UpdateEditionRequest {
    id?: string;
    displayName: string;
    concurrencyStamp?: string;
  }

  /**
   * Default connection string request
   * @deprecated Use TenantService.updateDefaultConnectionString(id, connectionString) instead. To be removed in v4.0.
   */
  export interface DefaultConnectionStringRequest {
    id: string;
    defaultConnectionString: string;
  }

  /**
   * Paginated response for tenants
   * @deprecated Use PagedResultDto<SaasTenantDto> instead. To be removed in v4.0.
   */
  export type TenantsResponse = PagedResultDto<Tenant>;

  /**
   * Paginated response for editions
   * @deprecated Use PagedResultDto<EditionDto> instead. To be removed in v4.0.
   */
  export type EditionsResponse = PagedResultDto<Edition>;

  /**
   * Usage statistics response
   * @deprecated Use GetEditionUsageStatisticsResult from proxy/host/models instead. To be removed in v4.0.
   */
  export interface UsageStatisticsResponse {
    data: Record<string, number>;
  }
}
