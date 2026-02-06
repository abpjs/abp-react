/**
 * Audit Logging Config Options
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Configuration options for customizing audit logging components.
 * @since 3.0.0
 */

import type {
  AuditLoggingEntityActionContributors,
  AuditLoggingToolbarActionContributors,
  AuditLoggingEntityPropContributors,
} from '../tokens/extensions.token';

/**
 * Configuration options for the audit logging module.
 * Allows customization of entity actions, toolbar actions, and entity properties.
 */
export interface AuditLoggingConfigOptions {
  /**
   * Contributors for adding custom entity actions to audit logging components.
   */
  entityActionContributors?: AuditLoggingEntityActionContributors;

  /**
   * Contributors for adding custom toolbar actions to audit logging components.
   */
  toolbarActionContributors?: AuditLoggingToolbarActionContributors;

  /**
   * Contributors for adding custom entity properties to audit logging components.
   */
  entityPropContributors?: AuditLoggingEntityPropContributors;
}

/**
 * Default configuration options for audit logging
 */
export const DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS: AuditLoggingConfigOptions = {};
