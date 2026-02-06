/**
 * Entity Change Service
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 */

import type { RestService } from '@abpjs/core';
import type { EntityChange } from '../models';

/**
 * Service for managing entity changes.
 * This service wraps the REST API calls for entity change operations.
 * @since 2.7.0
 */
export class EntityChangeService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  /**
   * Base URL for audit logs API
   */
  auditLogsUrl = '/api/audit-logging/audit-logs';

  constructor(private restService: RestService) {}

  /**
   * Get paginated list of entity changes
   * @param params Query parameters for filtering and pagination
   */
  async getEntityChanges(
    params: EntityChange.EntityChangesQueryParams = {}
  ): Promise<EntityChange.Response> {
    return this.restService.request<EntityChange.Response>({
      method: 'GET',
      url: `${this.auditLogsUrl}/entity-changes`,
      params: params as Record<string, unknown>,
    });
  }

  /**
   * Get a single entity change by ID
   * @param id The ID of the entity change to retrieve
   */
  async getEntityChangeById(id: string): Promise<EntityChange.Item> {
    return this.restService.request<EntityChange.Item>({
      method: 'GET',
      url: `${this.auditLogsUrl}/entity-changes/${id}`,
    });
  }

  /**
   * Get entity changes with user name for a specific entity
   * @param entityId The entity ID
   * @param entityTypeFullName The full type name of the entity
   */
  async getEntityChangesWithUserName(
    entityId: string,
    entityTypeFullName: string
  ): Promise<EntityChange.ItemWithUserName[]> {
    return this.restService.request<EntityChange.ItemWithUserName[]>({
      method: 'GET',
      url: `${this.auditLogsUrl}/entity-changes-with-username`,
      params: {
        entityId,
        entityTypeFullName,
      },
    });
  }

  /**
   * Get a single entity change with user name by ID
   * @param id The ID of the entity change to retrieve
   */
  async getEntityChangeWithUserNameById(
    id: string
  ): Promise<EntityChange.ItemWithUserName> {
    return this.restService.request<EntityChange.ItemWithUserName>({
      method: 'GET',
      url: `${this.auditLogsUrl}/entity-change-with-username/${id}`,
    });
  }
}
