/**
 * Entity Details Provider
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Provides entity details functionality for showing entity change details.
 * @since 3.0.0
 */

import {
  SHOW_ENTITY_DETAILS,
  type ShowEntityDetailsFn,
} from '../../tokens/entity-details.token';
import { EntityChangeModalService } from '../services/entity-change-modal.service';

/**
 * Bind the showDetails method from EntityChangeModalService to the SHOW_ENTITY_DETAILS token.
 *
 * @param service - The EntityChangeModalService instance
 * @returns A function that shows entity details for a given entity change ID
 */
export function bindShowDetails(
  service: EntityChangeModalService
): ShowEntityDetailsFn {
  return (entityChangeId: string) => {
    service.showDetails(entityChangeId);
  };
}

/**
 * Entity details providers configuration.
 * Provides the SHOW_ENTITY_DETAILS token implementation.
 */
export const ENTITY_DETAILS_PROVIDERS = {
  provide: SHOW_ENTITY_DETAILS,
  useFactory: bindShowDetails,
  deps: [EntityChangeModalService],
};

export { EntityChangeModalService };
