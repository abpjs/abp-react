/**
 * Default Entity Changes Entity Actions
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * Default entity actions for the EntityChangesComponent.
 * @since 3.0.0
 * @since 4.0.0 - Updated type from EntityChange.Item to EntityChangeDto
 */

import type { EntityAction } from '../tokens/extensions.token';
import type { EntityChangeDto } from '../proxy/audit-logging/models';

/**
 * Default entity actions for entity changes.
 * These actions are available by default in the entity changes table.
 */
export const DEFAULT_ENTITY_CHANGES_ENTITY_ACTIONS: EntityAction<EntityChangeDto>[] = [
  // Default actions can be added here
  // Example:
  // {
  //   text: 'AbpAuditLogging::ViewDetails',
  //   action: ({ record }) => { /* view details logic */ },
  //   icon: 'fas fa-eye',
  // },
];
