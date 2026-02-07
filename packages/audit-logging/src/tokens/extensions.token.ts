/**
 * Extensions Token
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * Provides extension tokens for customizing audit logging components.
 * @since 3.0.0
 * @since 4.0.0 - Updated type references from namespace types to proxy DTOs
 */

import type { eAuditLoggingComponents } from '../enums/components';
import type { AuditLogDto, EntityChangeDto } from '../proxy/audit-logging/models';

/**
 * Entity action definition for extensible components
 */
export interface EntityAction<T> {
  text: string;
  action: (data: { record: T }) => void;
  permission?: string;
  visible?: (data: { record: T }) => boolean;
  icon?: string;
  className?: string;
}

/**
 * Entity property definition for extensible components
 */
export interface EntityProp<T> {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  name: keyof T | string;
  displayName: string;
  sortable?: boolean;
  columnWidth?: number;
  valueResolver?: (data: { record: T }) => string | number | boolean;
  visible?: boolean;
}

/**
 * Toolbar action definition for extensible components
 */
export interface ToolbarAction<T> {
  text: string;
  action: (data: { records?: T }) => void;
  permission?: string;
  visible?: (data: { records?: T }) => boolean;
  icon?: string;
  className?: string;
}

/**
 * Callback type for contributing entity actions
 */
export type EntityActionContributorCallback<T> = (
  actionList: EntityAction<T>[]
) => EntityAction<T>[];

/**
 * Callback type for contributing entity properties
 */
export type EntityPropContributorCallback<T> = (
  propList: EntityProp<T>[]
) => EntityProp<T>[];

/**
 * Callback type for contributing toolbar actions
 */
export type ToolbarActionContributorCallback<T> = (
  actionList: ToolbarAction<T>[]
) => ToolbarAction<T>[];

/**
 * Default entity actions for audit logging components
 */
export const DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS: {
  [key in typeof eAuditLoggingComponents.AuditLogs]?: EntityAction<AuditLogDto>[];
} & {
  [key in typeof eAuditLoggingComponents.EntityChanges]?: EntityAction<EntityChangeDto>[];
} = {
  'AuditLogging.AuditLogsComponent': [],
  'AuditLogging.EntityChangesComponent': [],
};

/**
 * Default toolbar actions for audit logging components
 */
export const DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS: {
  [key in typeof eAuditLoggingComponents.AuditLogs]?: ToolbarAction<AuditLogDto[]>[];
} = {
  'AuditLogging.AuditLogsComponent': [],
};

/**
 * Default entity properties for audit logging components
 */
export const DEFAULT_AUDIT_LOGGING_ENTITY_PROPS: {
  [key in typeof eAuditLoggingComponents.AuditLogs]?: EntityProp<AuditLogDto>[];
} = {
  'AuditLogging.AuditLogsComponent': [],
};

/**
 * Type for audit logging entity action contributors
 */
export type AuditLoggingEntityActionContributors = Partial<{
  [eAuditLoggingComponents.AuditLogs]: EntityActionContributorCallback<AuditLogDto>[];
  [eAuditLoggingComponents.EntityChanges]: EntityActionContributorCallback<EntityChangeDto>[];
}>;

/**
 * Type for audit logging toolbar action contributors
 */
export type AuditLoggingToolbarActionContributors = Partial<{
  [eAuditLoggingComponents.AuditLogs]: ToolbarActionContributorCallback<AuditLogDto[]>[];
}>;

/**
 * Type for audit logging entity prop contributors
 */
export type AuditLoggingEntityPropContributors = Partial<{
  [eAuditLoggingComponents.AuditLogs]: EntityPropContributorCallback<AuditLogDto>[];
}>;

/**
 * Symbol token for audit logging entity action contributors
 */
export const AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS = Symbol(
  'AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS'
);

/**
 * Symbol token for audit logging toolbar action contributors
 */
export const AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS = Symbol(
  'AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS'
);

/**
 * Symbol token for audit logging entity prop contributors
 */
export const AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS = Symbol(
  'AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS'
);
