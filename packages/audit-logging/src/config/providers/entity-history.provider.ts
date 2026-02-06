/**
 * Entity History Provider
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Provides entity history functionality for showing entity change history.
 * @since 3.0.0
 */

import {
  SHOW_ENTITY_HISTORY,
  type ShowEntityHistoryFn,
} from '../../tokens/entity-details.token';
import { EntityChangeModalService } from '../services/entity-change-modal.service';

/**
 * Bind the showHistory method from EntityChangeModalService to the SHOW_ENTITY_HISTORY token.
 *
 * @param service - The EntityChangeModalService instance
 * @returns A function that shows entity history for a given entity
 */
export function bindShowHistory(
  service: EntityChangeModalService
): ShowEntityHistoryFn {
  return (entityId: string, entityTypeFullName: string) => {
    service.showHistory(entityId, entityTypeFullName);
  };
}

/**
 * Entity history providers configuration.
 * Provides the SHOW_ENTITY_HISTORY token implementation.
 */
export const ENTITY_HISTORY_PROVIDERS = {
  provide: SHOW_ENTITY_HISTORY,
  useFactory: bindShowHistory,
  deps: [EntityChangeModalService],
};

export { EntityChangeModalService };
