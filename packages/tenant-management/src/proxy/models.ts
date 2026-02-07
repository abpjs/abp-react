/**
 * Proxy models for Tenant Management module
 * Translated from @abp/ng.tenant-management v3.2.0 lib/proxy/models.d.ts
 *
 * These are the typed DTOs for the Tenant Management API.
 * @since 3.2.0
 */

import type { ExtensibleEntityDto, ExtensibleObject, PagedAndSortedResultRequestDto } from '@abpjs/core';

/**
 * Input parameters for getting a list of tenants.
 * Extends PagedAndSortedResultRequestDto for pagination and sorting.
 * @since 3.2.0
 */
export interface GetTenantsInput extends PagedAndSortedResultRequestDto {
  /** Filter string to search tenants by name */
  filter: string;
}

/**
 * Base DTO for tenant create and update operations.
 * Extends ExtensibleObject for extra properties support.
 * @since 3.2.0
 */
export interface TenantCreateOrUpdateDtoBase extends ExtensibleObject {
  /** The name of the tenant */
  name: string;
}

/**
 * DTO for creating a new tenant.
 * Extends TenantCreateOrUpdateDtoBase with admin credentials.
 * @since 3.2.0
 */
export interface TenantCreateDto extends TenantCreateOrUpdateDtoBase {
  /** Admin email address for the new tenant */
  adminEmailAddress: string;
  /** Admin password for the new tenant */
  adminPassword: string;
}

/**
 * DTO for updating an existing tenant.
 * Extends TenantCreateOrUpdateDtoBase (only name is updatable).
 * @since 3.2.0
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TenantUpdateDto extends TenantCreateOrUpdateDtoBase {}

/**
 * DTO representing a tenant entity.
 * Extends ExtensibleEntityDto with string ID.
 * @since 3.2.0
 */
export interface TenantDto extends ExtensibleEntityDto<string> {
  /** The name of the tenant */
  name: string;
}
