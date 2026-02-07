/**
 * Identity Security Log Models
 * Types for security log management in the Identity module.
 * @since 3.1.0
 */

import { PagedResultDto } from '@abpjs/core';

/**
 * Security log data transfer object.
 * Represents a security event logged in the system.
 * @since 3.1.0
 */
export interface IdentitySecurityLogDto {
  /** Unique identifier for the log entry */
  id: string;
  /** Tenant ID if applicable */
  tenantId?: string | null;
  /** Application name */
  applicationName?: string | null;
  /** Identity of the user (e.g., username) */
  identity?: string | null;
  /** The action performed (e.g., LoginSucceeded, LoginFailed) */
  action?: string | null;
  /** User ID if logged in */
  userId?: string | null;
  /** Username if available */
  userName?: string | null;
  /** Client IP address */
  clientIpAddress?: string | null;
  /** Client ID for OAuth clients */
  clientId?: string | null;
  /** Correlation ID for request tracing */
  correlationId?: string | null;
  /** Browser information (user agent) */
  browserInfo?: string | null;
  /** When the event occurred */
  creationTime: string;
  /** Extra properties dictionary */
  extraProperties?: Record<string, unknown>;
}

/**
 * Input parameters for querying security logs.
 * @since 3.1.0
 */
export interface IdentitySecurityLogGetListInput {
  /** Filter term */
  filter?: string;
  /** Start date for date range filter */
  startTime?: string;
  /** End date for date range filter */
  endTime?: string;
  /** Application name filter */
  applicationName?: string;
  /** Identity filter */
  identity?: string;
  /** Action filter */
  action?: string;
  /** User ID filter */
  userId?: string;
  /** Username filter */
  userName?: string;
  /** Client ID filter */
  clientId?: string;
  /** Correlation ID filter */
  correlationId?: string;
  /** Sorting expression */
  sorting?: string;
  /** Number of items to skip */
  skipCount?: number;
  /** Maximum number of items to return */
  maxResultCount?: number;
}

/**
 * Paginated response for security logs.
 * @since 3.1.0
 */
export type IdentitySecurityLogResponse = PagedResultDto<IdentitySecurityLogDto>;

/**
 * Factory function to create a default IdentitySecurityLogGetListInput.
 * @since 3.1.0
 */
export function createIdentitySecurityLogGetListInput(
  overrides: Partial<IdentitySecurityLogGetListInput> = {}
): IdentitySecurityLogGetListInput {
  return {
    skipCount: 0,
    maxResultCount: 10,
    ...overrides,
  };
}
