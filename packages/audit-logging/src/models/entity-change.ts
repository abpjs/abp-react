/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Entity Change Models
 * Translated from @volo/abp.ng.audit-logging v3.2.0
 *
 * @since 3.2.0 - Deprecated in favor of proxy DTOs
 */

import type { ABP } from '@abpjs/core';
import type { eEntityChangeType } from '../enums/entity-change';

/**
 * EntityChange namespace containing all models
 * for entity change management.
 * @since 2.7.0
 * @deprecated To be removed in v4.0. Use EntityChangeDto, EntityChangeWithUsernameDto, and GetEntityChangesDto from proxy instead.
 */
export namespace EntityChange {
  /**
   * Paginated response of entity changes
   */
  export type Response = ABP.PagedResponse<Item>;

  /**
   * Query parameters for fetching entity changes
   */
  export type EntityChangesQueryParams = Partial<
    {
      auditLogId: string;
      entityChangeType: eEntityChangeType;
      entityId: string;
      entityTypeFullName: string;
      startDate: string;
      endDate: string;
    } & ABP.PageQueryParams
  >;

  /**
   * Entity change item with associated user name
   */
  export interface ItemWithUserName {
    entityChange: Item;
    userName: string;
  }

  /**
   * Entity change item
   */
  export interface Item {
    auditLogId: string;
    tenantId: string | null;
    changeTime: string;
    changeType: eEntityChangeType;
    entityId: string;
    entityTypeFullName: string;
    propertyChanges: PropertyChange[];
    id: string;
    extraProperties: ExtraProperties;
  }

  /**
   * Property change within an entity change
   */
  export interface PropertyChange {
    tenantId: string | null;
    entityChangeId: string;
    newValue: string;
    originalValue: string;
    propertyName: string;
    propertyTypeFullName: string;
    id: string;
  }

  /**
   * Extra properties map
   */
  export type ExtraProperties = Record<string, unknown>;
}
