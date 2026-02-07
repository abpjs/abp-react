/**
 * Entity Change Type Enum (Proxy)
 * Translated from @volo/abp.ng.audit-logging v3.2.0
 *
 * @since 3.2.0 - Added as part of proxy subpackage
 */

/**
 * Enum representing the type of change made to an entity.
 * Used in typed DTOs for entity change tracking.
 *
 * @remarks
 * This enum is part of the new proxy subpackage introduced in v3.2.0.
 * It provides the same values as eEntityChangeType but is used in the
 * typed proxy DTOs.
 */
export enum EntityChangeType {
  Created = 0,
  Updated = 1,
  Deleted = 2,
}

/**
 * Options for EntityChangeType enum for use in select components.
 * Provides label/value pairs for each enum member.
 */
export const entityChangeTypeOptions = [
  { label: 'Created', value: EntityChangeType.Created },
  { label: 'Updated', value: EntityChangeType.Updated },
  { label: 'Deleted', value: EntityChangeType.Deleted },
] as const;
