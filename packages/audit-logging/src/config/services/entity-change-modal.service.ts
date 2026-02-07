/**
 * Entity Change Modal Service
 * Translated from @volo/abp.ng.audit-logging v4.0.0
 *
 * Service for displaying entity change details and history in modals.
 * @since 3.0.0
 * @since 4.0.0 - Now uses AuditLogsService instead of EntityChangeService
 */

import { AuditLogsService } from '../../proxy/audit-logging/audit-logs.service';
import type { EntityChangeWithUsernameDto } from '../../proxy/audit-logging/models';

/**
 * Callback type for when entity change details are fetched
 */
export type EntityChangeDetailsCallback = (data: EntityChangeWithUsernameDto) => void;

/**
 * Callback type for when entity change history is fetched
 */
export type EntityChangeHistoryCallback = (data: EntityChangeWithUsernameDto[]) => void;

/**
 * Service for managing entity change modal display.
 * Provides methods to show entity change details and history.
 */
export class EntityChangeModalService {
  private detailsCallback: EntityChangeDetailsCallback | null = null;
  private historyCallback: EntityChangeHistoryCallback | null = null;

  constructor(private auditLogsService: AuditLogsService) {}

  /**
   * Register a callback for entity change details display
   */
  onShowDetails(callback: EntityChangeDetailsCallback): void {
    this.detailsCallback = callback;
  }

  /**
   * Register a callback for entity change history display
   */
  onShowHistory(callback: EntityChangeHistoryCallback): void {
    this.historyCallback = callback;
  }

  /**
   * Show entity change details for a specific entity change.
   * Fetches the entity change with username and triggers the registered callback.
   *
   * @param entityChangeId - The ID of the entity change to display
   */
  async showDetails(entityChangeId: string): Promise<void> {
    try {
      const data = await this.auditLogsService.getEntityChangeWithUsername(entityChangeId);
      if (this.detailsCallback) {
        this.detailsCallback(data);
      }
    } catch (error) {
      console.error('Failed to fetch entity change details:', error);
      throw error;
    }
  }

  /**
   * Show entity change history for a specific entity.
   * Fetches all entity changes with usernames and triggers the registered callback.
   *
   * @param entityId - The ID of the entity
   * @param entityTypeFullName - The full type name of the entity
   */
  async showHistory(entityId: string, entityTypeFullName: string): Promise<void> {
    try {
      const data = await this.auditLogsService.getEntityChangesWithUsername({
        entityId,
        entityTypeFullName,
      });
      if (this.historyCallback) {
        this.historyCallback(data);
      }
    } catch (error) {
      console.error('Failed to fetch entity change history:', error);
      throw error;
    }
  }

  /**
   * Trigger change detection (no-op in React, kept for API compatibility)
   */
  detectChanges(): void {
    // In React, state changes trigger re-renders automatically
  }
}
