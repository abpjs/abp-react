/**
 * SaaS Proxy DTOs
 * Translated from @volo/abp.ng.saas v3.2.0
 *
 * Typed Data Transfer Objects for the SaaS module proxy services.
 *
 * @since 3.2.0
 */

import type { ABP } from '@abpjs/core';

// ========================
// Edition DTOs
// ========================

/**
 * Base DTO for edition create/update operations
 * @since 3.2.0
 */
export interface EditionCreateOrUpdateDtoBase {
  displayName: string;
  extraProperties?: ABP.Dictionary<unknown>;
}

/**
 * DTO for creating a new edition
 * @since 3.2.0
 */
export type EditionCreateDto = EditionCreateOrUpdateDtoBase;

/**
 * DTO for updating an edition
 * @since 3.2.0
 */
export type EditionUpdateDto = EditionCreateOrUpdateDtoBase;

/**
 * DTO for edition entity response
 * @since 3.2.0
 */
export interface EditionDto {
  id: string;
  displayName: string;
  concurrencyStamp?: string;
  creationTime?: string | Date;
  creatorId?: string;
  extraProperties?: ABP.Dictionary<unknown>;
}

/**
 * Query input for fetching editions
 * @since 3.2.0
 */
export interface GetEditionsInput {
  filter?: string;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

// ========================
// Tenant DTOs
// ========================

/**
 * Base DTO for tenant create/update operations
 * @since 3.2.0
 */
export interface SaasTenantCreateOrUpdateDtoBase {
  name: string;
  editionId?: string;
  extraProperties?: ABP.Dictionary<unknown>;
}

/**
 * DTO for creating a new tenant
 * @since 3.2.0
 */
export interface SaasTenantCreateDto extends SaasTenantCreateOrUpdateDtoBase {
  adminEmailAddress: string;
  adminPassword: string;
}

/**
 * DTO for updating a tenant
 * @since 3.2.0
 */
export type SaasTenantUpdateDto = SaasTenantCreateOrUpdateDtoBase;

/**
 * DTO for tenant entity response
 * @since 3.2.0
 */
export interface SaasTenantDto {
  id: string;
  name: string;
  editionId?: string;
  editionName?: string;
  concurrencyStamp?: string;
  creationTime?: string | Date;
  creatorId?: string;
  extraProperties?: ABP.Dictionary<unknown>;
}

/**
 * Query input for fetching tenants
 * @since 3.2.0
 */
export interface GetTenantsInput {
  filter?: string;
  getEditionNames?: boolean;
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}
