/**
 * Template Definition Service
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 *
 * Provides REST API methods for managing text template definitions.
 */

import type { RestService, PagedResultRequestDto, ListResultDto } from '@abpjs/core';
import type { TextTemplateManagement } from '../models';

/**
 * Service for template definition operations.
 * This service wraps all REST API calls for template definitions.
 *
 * @since 2.7.0
 */
export class TemplateDefinitionService {
  /**
   * API name for multi-API configurations
   * @since 2.7.0
   */
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Get list of template definitions
   * @param params Query parameters for filtering and pagination
   * @returns Promise with list of template definitions
   */
  async getList(
    params: Partial<PagedResultRequestDto> = {}
  ): Promise<ListResultDto<TextTemplateManagement.TemplateDefinitionDto>> {
    return this.restService.request<
      null,
      ListResultDto<TextTemplateManagement.TemplateDefinitionDto>
    >({
      method: 'GET',
      url: '/api/text-template-management/template-definitions',
      params,
    });
  }
}
