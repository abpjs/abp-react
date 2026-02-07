/**
 * Audit Logging Proxy Models
 * Translated from @volo/abp.ng.audit-logging v3.2.0
 *
 * @since 3.2.0 - Added as part of proxy subpackage with typed DTOs
 */

import type { EntityChangeType } from '../auditing/entity-change-type.enum';

/**
 * DTO for audit log actions.
 * Represents a single action within an audit log entry.
 */
export interface AuditLogActionDto {
  /** Unique identifier for the action */
  id: string;
  /** Extra properties map */
  extraProperties?: Record<string, unknown>;
  /** Tenant ID (if multi-tenant) */
  tenantId?: string;
  /** Parent audit log ID */
  auditLogId: string;
  /** Name of the service that performed the action */
  serviceName: string;
  /** Name of the method that was called */
  methodName: string;
  /** JSON representation of method parameters */
  parameters: string;
  /** When the action was executed (ISO 8601 format) */
  executionTime: string;
  /** Duration of execution in milliseconds */
  executionDuration: number;
}

/**
 * DTO for audit logs.
 * Represents a complete audit log entry with all related data.
 */
export interface AuditLogDto {
  /** Unique identifier for the audit log */
  id: string;
  /** Extra properties map */
  extraProperties?: Record<string, unknown>;
  /** ID of the user who performed the action */
  userId?: string;
  /** Username of the user who performed the action */
  userName: string;
  /** Tenant ID (if multi-tenant) */
  tenantId?: string;
  /** ID of the user being impersonated (if any) */
  impersonatorUserId?: string;
  /** Tenant ID of the impersonator (if any) */
  impersonatorTenantId?: string;
  /** When the request was executed (ISO 8601 format) */
  executionTime: string;
  /** Duration of the request in milliseconds */
  executionDuration: number;
  /** IP address of the client */
  clientIpAddress: string;
  /** Name of the client application */
  clientName: string;
  /** Browser/user agent information */
  browserInfo: string;
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  httpMethod: string;
  /** Request URL */
  url: string;
  /** Exception details (if any) */
  exceptions: string;
  /** Additional comments */
  comments: string;
  /** HTTP status code of the response */
  httpStatusCode?: number;
  /** Name of the application */
  applicationName: string;
  /** Correlation ID for request tracing */
  correlationId: string;
  /** Entity changes that occurred during the request */
  entityChanges: EntityChangeDto[];
  /** Actions performed during the request */
  actions: AuditLogActionDto[];
}

/**
 * DTO for entity changes.
 * Represents a change made to an entity during an audited operation.
 */
export interface EntityChangeDto {
  /** Unique identifier for the entity change */
  id: string;
  /** Extra properties map */
  extraProperties?: Record<string, unknown>;
  /** Parent audit log ID */
  auditLogId: string;
  /** Tenant ID (if multi-tenant) */
  tenantId?: string;
  /** When the change occurred (ISO 8601 format) */
  changeTime: string;
  /** Type of change (Created, Updated, Deleted) */
  changeType: EntityChangeType;
  /** ID of the changed entity */
  entityId: string;
  /** Full type name of the entity */
  entityTypeFullName: string;
  /** Property changes within this entity change */
  propertyChanges: EntityPropertyChangeDto[];
}

/**
 * Filter parameters for querying entity changes.
 */
export interface EntityChangeFilter {
  /** ID of the entity to filter by */
  entityId: string;
  /** Full type name of the entity to filter by */
  entityTypeFullName: string;
}

/**
 * DTO for entity change with associated username.
 * Provides entity change data along with the user who made the change.
 */
export interface EntityChangeWithUsernameDto {
  /** The entity change data */
  entityChange: EntityChangeDto;
  /** Username of the user who made the change */
  userName: string;
}

/**
 * DTO for entity property changes.
 * Represents a single property change within an entity change.
 */
export interface EntityPropertyChangeDto {
  /** Unique identifier for the property change */
  id: string;
  /** Tenant ID (if multi-tenant) */
  tenantId?: string;
  /** Parent entity change ID */
  entityChangeId: string;
  /** New value of the property (JSON string) */
  newValue: string;
  /** Original value of the property (JSON string) */
  originalValue: string;
  /** Name of the property */
  propertyName: string;
  /** Full type name of the property */
  propertyTypeFullName: string;
}

/**
 * DTO for getting a paginated list of audit logs.
 * Extends PagedAndSortedResultRequestDto with audit-specific filters.
 */
export interface GetAuditLogListDto {
  /** URL to filter by */
  url?: string;
  /** Username to filter by */
  userName?: string;
  /** Application name to filter by */
  applicationName?: string;
  /** Correlation ID to filter by */
  correlationId?: string;
  /** HTTP method to filter by */
  httpMethod?: string;
  /** HTTP status code to filter by */
  httpStatusCode?: number;
  /** Maximum execution duration to filter by */
  maxExecutionDuration?: number;
  /** Minimum execution duration to filter by */
  minExecutionDuration?: number;
  /** Filter by presence of exceptions */
  hasException?: boolean;
  /** Sorting expression (e.g., "executionTime desc") */
  sorting?: string;
  /** Number of results to skip */
  skipCount?: number;
  /** Maximum number of results to return */
  maxResultCount?: number;
}

/**
 * Input for getting average execution duration per day.
 */
export interface GetAverageExecutionDurationPerDayInput {
  /** Start date for the query (ISO 8601 format) */
  startDate: string;
  /** End date for the query (ISO 8601 format) */
  endDate: string;
}

/**
 * Output for average execution duration per day query.
 */
export interface GetAverageExecutionDurationPerDayOutput {
  /** Map of date string to average duration in milliseconds */
  data: Record<string, number>;
}

/**
 * DTO for getting entity changes with pagination.
 */
export interface GetEntityChangesDto {
  /** Parent audit log ID to filter by */
  auditLogId?: string;
  /** Entity change type to filter by */
  entityChangeType?: EntityChangeType;
  /** Entity ID to filter by */
  entityId?: string;
  /** Full type name of the entity to filter by */
  entityTypeFullName?: string;
  /** Start date for the query (ISO 8601 format) */
  startDate?: string;
  /** End date for the query (ISO 8601 format) */
  endDate?: string;
  /** Sorting expression */
  sorting?: string;
  /** Number of results to skip */
  skipCount?: number;
  /** Maximum number of results to return */
  maxResultCount?: number;
}

/**
 * Filter parameters for error rate queries.
 */
export interface GetErrorRateFilter {
  /** Start date for the query (ISO 8601 format) */
  startDate: string;
  /** End date for the query (ISO 8601 format) */
  endDate: string;
}

/**
 * Output for error rate query.
 */
export interface GetErrorRateOutput {
  /** Map of date string to error count */
  data: Record<string, number>;
}
