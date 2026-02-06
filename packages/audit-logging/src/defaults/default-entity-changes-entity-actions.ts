/**
 * Default Entity Changes Entity Actions
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Default entity actions for the EntityChangesComponent.
 * @since 3.0.0
 */

import type { EntityAction } from '../tokens/extensions.token';
import type { EntityChange } from '../models/entity-change';

/**
 * Default entity actions for entity changes.
 * These actions are available by default in the entity changes table.
 */
export const DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS: EntityAction<EntityChange.Item>[] = [
  // Default actions can be added here
  // Example:
  // {
  //   text: 'AbpAuditLogging::ViewDetails',
  //   action: ({ record }) => { /* view details logic */ },
  //   icon: 'fas fa-eye',
  // },
];
